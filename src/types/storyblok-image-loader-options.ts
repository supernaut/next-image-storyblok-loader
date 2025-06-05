import type { StoryblokImageFormat } from "./storyblok-image-format";
import type { StoryblokImageResize } from "./storyblok-image-resize";

export type StoryblokImageLoaderOptions = {
  focus?: string;
  format?: StoryblokImageFormat;
  host?: string;
  prefix?: string;
  quality?: number;
  resize?: StoryblokImageResize;
  smart?: boolean;
};
