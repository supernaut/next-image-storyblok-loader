import type { AssetStoryblok } from "../types/asset-storyblok";
import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";
import { parseStoryblokSrc } from "./parse-storyblok-src";

export function getStoryblokImageFilename(
  image: AssetStoryblok | string | undefined,
  imageOptions?: StoryblokImageLoaderOptions | null,
) {
  let filename = "";
  const focus = typeof image === "string" ? undefined : image?.focus;
  const options = {
    ...(imageOptions || {}),
    focus: typeof image === "string" ? undefined : image?.focus,
  };
  if (typeof image === "string") {
    const parsed = parseStoryblokSrc(image, imageOptions);
    filename = parsed.filename;
    options.focus = focus || parsed.focus;
    options.format = options?.format || parsed.format;
    options.quality = options?.quality || parsed.quality;
    options.resize = options?.resize || parsed.resize;
  }
  if (typeof image !== "string" && image?.filename) {
    filename = image?.filename;
  }

  return {
    filename,
    options,
  };
}
