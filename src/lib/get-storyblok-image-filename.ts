import type { AssetStoryblok } from "../types/asset-storyblok";
import {
  StoryblokImageLoaderOptionsKeys,
  type StoryblokImageLoaderOptions,
} from "../types/storyblok-image-loader-options";
import { parseStoryblokSrc } from "./parse-storyblok-src";

export function getStoryblokImageFilename(
  image: AssetStoryblok | string | undefined,
  imageOptions?: StoryblokImageLoaderOptions | null,
) {
  let filename = "";
  const options: StoryblokImageLoaderOptions = imageOptions || {};
  if (image && typeof image !== "string" && !!image?.focus) {
    options.focus = image?.focus;
  }
  if (typeof image === "string") {
    const parsed = parseStoryblokSrc(image, options);
    filename = parsed.filename;
    if (typeof parsed.focus !== "undefined") {
      options.focus = parsed.focus;
    }
    if (typeof parsed.format !== "undefined") {
      options.format = parsed.format;
    }
    if (typeof parsed.quality !== "undefined") {
      options.quality = parsed.quality;
    }
    if (typeof parsed.resize !== "undefined") {
      options.resize = parsed.resize;
    }
  }
  if (typeof image !== "string" && image?.filename) {
    filename = image?.filename;
  }

  return {
    filename,
    options,
  };
}
