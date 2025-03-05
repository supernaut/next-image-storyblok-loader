import type { ImageLoader } from "next/image";
import { getStoryblokSrc } from "./get-storyblok-src";
import { parseStoryblokSrc } from "./parse-storyblok-src";
import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";

/**
 * Get a Storyblok image loader for Next.js Image component.
 * @param options Options for the loader
 * @returns Image loader function
 */
export function getStoryblokImageLoader(
  options?: StoryblokImageLoaderOptions,
): ImageLoader {
  return ({ src, width: inputWidth, quality }) => {
    const url = new URL(src);

    const parsed = parseStoryblokSrc(src);

    const parts = url.pathname.split("/");
    const size = parts[3].split("x");
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

    return (
      getStoryblokSrc(src, {
        ...(options || {}),
        quality,
        resize,
      }) || src
    );
  };
}
