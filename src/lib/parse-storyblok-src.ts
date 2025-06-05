import type { ParsedStoryblokSrc } from "../types/parsed-storyblok-src";
import type { StoryblokImageFormat } from "../types/storyblok-image-format";
import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";
import type { StoryblokImageResize } from "../types/storyblok-image-resize";

import { getStoryblokSrcHost } from "./get-storyblok-src-host";

export function parseStoryblokSrc(
  src: string,
  options?: StoryblokImageLoaderOptions,
): ParsedStoryblokSrc {
  // Create URL object from src input
  const url = new URL(src);

  // Set correct hostname for src URL
  url.host = getStoryblokSrcHost(options?.host);

  const parts = url.pathname.split("/");
  const path = parts.slice(0, 6).join("/");
  const result: ParsedStoryblokSrc = {
    filename: new URL(path, url).href.replace(/\/m\b\/?.*$/, ""),
  };

  const size = /^\d+x\d+$/.test(parts[parts.indexOf("m") + 1])
    ? parts[parts.indexOf("m") + 1]
    : undefined;
  let resize: StoryblokImageResize | undefined;
  if (size) {
    const [width, height] = size.split("x");
    resize = {
      height: Number.parseInt(height, 10),
      width: Number.parseInt(width, 10),
    };
  }
  const filters = parts
    .find((part) => part.startsWith("filters:"))
    ?.substring(8)
    .replace(/:([a-z])/g, "__$1")
    .split("__");
  const qualityFilter = filters?.find((filter) => filter.startsWith("quality"));
  const focalFilter = filters?.find((filter) => filter.startsWith("focal"));
  const formatFilter = filters?.find((filter) => filter.startsWith("format"));
  const quality = qualityFilter
    ? Number.parseInt(qualityFilter?.replace(/quality\((.+)\)/, "$1"), 10)
    : undefined;
  const format = formatFilter
    ? (formatFilter?.replace(/format\((.+)\)/, "$1") as StoryblokImageFormat)
    : undefined;
  const focus = focalFilter
    ? focalFilter?.replace(/focal\((.+?)\)/, "$1")
    : undefined;

  if (typeof resize !== "undefined") {
    result.resize = resize;
  }
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
