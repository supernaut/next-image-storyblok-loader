import type { ParsedStoryblokSrc } from "../types/parsed-storyblok-src";
import type { StoryblokImageFormat } from "../types/storyblok-image-format";
import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";
import type { StoryblokImageResize } from "../types/storyblok-image-resize";

import { StoryblokImageFocus } from "../types/storyblok-image-focus";
import { getStoryblokSrcHost } from "./get-storyblok-src-host";

// Precompiled regex patterns (compiled once per module load)
const SIZE_PATTERN = /^(\d+)x(\d+)$/;
const FOCAL_PATTERN = /focal\((\d+)x(\d+):(\d+)x(\d+)\)/;

// Allow only explicitly supported formats to avoid unsafe casting
const ALLOWED_FORMATS: readonly StoryblokImageFormat[] = [
  "avif",
  "jpeg",
  "png",
  "webp",
];

type ParsedFilters = {
  focus?: StoryblokImageFocus;
  format?: StoryblokImageFormat;
  quality?: number;
};

export function parseStoryblokSrc(
  src: string,
  options?: StoryblokImageLoaderOptions,
): ParsedStoryblokSrc {
  let url: URL;
  try {
    url = new URL(src);
  } catch (error) {
    console.error(error);
    throw new TypeError(`Invalid Storyblok image URL: ${src}`);
  }

  // Normalize host (retain original protocol)
  url.host = getStoryblokSrcHost(options?.host);

  const pathSegments = url.pathname.split("/").filter(Boolean); // drop empty leading segment
  const mIndex = pathSegments.indexOf("m");

  // Base filename should point to the original asset root, i.e., everything before /m/... (if present)
  // Examples:
  //  /f/123456/image.jpg -> /f/123456/image.jpg (no transformation)
  //  /f/123456/m/800x600/filters:.../image.jpg -> /f/123456
  const baseSegments =
    mIndex >= 0 ? pathSegments.slice(0, mIndex) : pathSegments;
  // If we have a direct asset (no m) keep full path; if transformed, only keep first 2 segments after /f
  // Previous implementation sliced first 6 raw splits; replicating intent by reconstructing then trimming '/m'
  // Build a preliminary filename URL
  const basePath = `/${baseSegments.join("/")}`;
  const filename = new URL(basePath, url).href;

  const result: ParsedStoryblokSrc = { filename };

  // Size parsing (only when 'm' segment is present and followed by \d+x\d+)
  if (mIndex >= 0) {
    const sizeCandidate = pathSegments[mIndex + 1];
    const sizeMatch = SIZE_PATTERN.exec(sizeCandidate || "");
    if (sizeMatch) {
      const width = Number.parseInt(sizeMatch[1], 10);
      const height = Number.parseInt(sizeMatch[2], 10);
      if (!Number.isNaN(width) && !Number.isNaN(height)) {
        const resize: StoryblokImageResize = { height, width };
        result.resize = resize;
      }
    }
  }

  // Filters parsing (look for the first segment that starts with filters:)
  const filtersSegment = pathSegments.find((segment) =>
    segment.startsWith("filters:"),
  );
  const { focus, format, quality } = parseFilters(filtersSegment);
  if (typeof quality !== "undefined") {
    result.quality = quality;
  }
  if (typeof format !== "undefined") {
    result.format = format;
  }
  if (typeof focus !== "undefined") {
    result.focus = focus;
  }

  return result;
}

function parseFilters(segment?: string): ParsedFilters {
  if (!segment || !segment.startsWith("filters:")) return {};
  // Remove the leading "filters:" then split into individual filters preserving order
  const rawFilters = segment
    .substring("filters:".length)
    // Convert :x to __x so we can split safely while keeping order
    .replace(/:([a-z])/g, "__$1")
    .split("__");

  const parsed: ParsedFilters = {};
  for (const filter of rawFilters) {
    if (filter.startsWith("quality")) {
      const value = Number.parseInt(
        filter.replace(/quality\((.+)\)/, "$1"),
        10,
      );
      if (!Number.isNaN(value) && value >= 1 && value <= 100) {
        parsed.quality = value;
      }
    } else if (filter.startsWith("format")) {
      const value = filter.replace(
        /format\((.+)\)/,
        "$1",
      ) as StoryblokImageFormat;
      if (ALLOWED_FORMATS.includes(value)) {
        parsed.format = value;
      }
    } else if (filter.startsWith("focal") && FOCAL_PATTERN.test(filter)) {
      parsed.focus = filter.replace(
        FOCAL_PATTERN,
        "$1x$2:$3x$4",
      ) as StoryblokImageFocus;
    }
  }
  return parsed;
}
