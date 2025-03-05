import type { AssetStoryblok } from "../types/asset-storyblok";
import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";
import { getStoryblokImageFilename } from "./get-storyblok-image-filename";
import { getStoryblokImageFilters } from "./get-storyblok-image-filters";
import { getStoryblokImageSize } from "./get-storyblok-image-size";
import { imgSrcIsStoryblok } from "./img-src-is-storyblok";

/**
 * Get Storyblok image src URL from given asset and options
 * @param image Storyblok asset or image URL
 * @param imageOptions Options for constructing the image URL
 * @returns URL string or undefined if no URL could be constructed
 */
export function getStoryblokSrc(
  image: AssetStoryblok | string | undefined,
  imageOptions?: StoryblokImageLoaderOptions | null,
): string | undefined {
  // Exit if provided image is a Storyblok asset with no filename
  if (typeof image !== "string" && !image?.filename) {
    return;
  }

  // Exit if image is a string and not a Storyblok asset URL
  if (
    typeof image === "string" &&
    !imgSrcIsStoryblok(image, imageOptions.host)
  ) {
    return image;
  }

  // Get filename
  const { filename, options } = getStoryblokImageFilename(image, imageOptions);

  // Exit if no filename could be constructed
  if (!filename) {
    return;
  }

  // Create an array of path based options
  const parts: (string | undefined)[] = [filename, "m"];

  // Add resize options if set
  if (options?.resize) {
    parts.push(getStoryblokImageSize(options.resize));
  }

  // Add smart format option if not explicitly disabled
  if ((options?.resize || options?.focus) && options?.smart !== false) {
    parts.push("smart");
  }

  // Add filters if set
  parts.push(getStoryblokImageFilters({ ...options }));

  // Join parts into a path string
  const src = parts.filter(Boolean).join("/");

  // If a prefix is set, remove host and prepend prefix
  if (imageOptions?.prefix || process.env.STORYBLOK_IMAGE_LOADER_PREFIX) {
    const prefix =
      imageOptions?.prefix || process.env.STORYBLOK_IMAGE_LOADER_PREFIX;
    const url = new URL(src);
    return `${prefix}${url.pathname}`.replace("//", "/");
  }

  // Return the constructed URL
  return src;
}
