import type { StoryblokImageLoaderOptions } from "../types/storyblok-image-loader-options";

import { getStoryblokImageQuality } from "./get-storyblok-image-quality";

export function getStoryblokImageFilters(
  options?: StoryblokImageLoaderOptions,
): string | undefined {
  const filters: string[] = [];

  if (options?.format) {
    filters.push(`format(${options.format})`);
  }
  if (typeof options?.quality === "number") {
    filters.push(getStoryblokImageQuality(options.quality));
  }
  if (options?.resize && options?.focus) {
    filters.push(`focal(${options.focus})`);
  }
  const filtersString = filters.filter(Boolean).join(":");
  return filtersString ? `filters:${filtersString}` : undefined;
}
