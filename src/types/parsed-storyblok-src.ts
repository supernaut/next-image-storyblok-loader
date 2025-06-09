import type { StoryblokImageLoaderOptions } from "./storyblok-image-loader-options";

export type ParsedStoryblokSrc = {
  filename: string;
} & Pick<
  StoryblokImageLoaderOptions,
  "focus" | "format" | "quality" | "resize"
>;
