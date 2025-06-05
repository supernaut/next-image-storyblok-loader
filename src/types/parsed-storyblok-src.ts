import type { StoryblokImageLoaderOptions } from "./storyblok-image-loader-options";

export type ParsedStoryblokSrc = Pick<
  StoryblokImageLoaderOptions,
  "quality" | "format" | "focus" | "resize"
> & {
  filename: string;
};
