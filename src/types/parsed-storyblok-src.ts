import type { StoryblokImageLoaderOptions } from "./storyblok-image-loader-options";

export type ParsedStoryblokSrc = Pick<
  StoryblokImageLoaderOptions,
  "focus" | "format" | "quality" | "resize"
> & {
  filename: string;
};
