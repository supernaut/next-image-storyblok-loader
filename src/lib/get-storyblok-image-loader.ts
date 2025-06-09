import type { ImageLoader } from "next/image";

import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";

import { getStoryblokSrc } from "./get-storyblok-src";
import { imgSrcIsStoryblok } from "./img-src-is-storyblok";
import { parseStoryblokSrc } from "./parse-storyblok-src";

/**
 * Get a Storyblok image loader for Next.js Image component.
 * @param options Options for the loader
 * @returns Image loader function
 */
export function getStoryblokImageLoader(
  options: StoryblokImageLoaderOptions = {},
): ImageLoader {
  return ({ quality, src, width: inputWidth }) => {
    // Check if it's a Storyblok URL first
    if (!imgSrcIsStoryblok(src, options.host)) {
      return src;
    }

    const url = new URL(src);

    const parsed = parseStoryblokSrc(src);

    const parts = url.pathname.split("/");
    const size = parts[3]?.split("x");

    if (!size || size.length < 2) {
      // If URL doesn't have the expected format, use getStoryblokSrc directly
      const loaderOptions: StoryblokImageLoaderOptions = {
        ...options,
        resize: { width: inputWidth },
      };
      if (typeof quality === "number") {
        loaderOptions.quality = quality;
      }
      return getStoryblokSrc(src, loaderOptions) || src;
    }

    const originalWidth = Number.parseInt(size[0], 10);
    const originalHeight = Number.parseInt(size[1], 10);

    const originalAspectRatio = originalWidth / originalHeight;
    let resizedAspectRatio = originalAspectRatio;

    if (parsed.resize?.height) {
      resizedAspectRatio = parsed.resize.width / parsed.resize.height;
    }

    const resize = {
      height: resizedAspectRatio
        ? Math.floor(inputWidth / resizedAspectRatio)
        : 0,
      width: inputWidth,
    };

    if (typeof quality !== "undefined") {
      options.quality = quality;
    }
    if (inputWidth !== undefined && typeof resize !== "undefined") {
      options.resize = resize;
    }

    return getStoryblokSrc(src, options) || src;
  };
}
