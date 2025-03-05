import type { StoryblokImageResize } from "./storyblok-image-resize";
import type { StoryblokImageFormat } from "./storyblok-image-format";

export interface StoryblokImageLoaderOptions {
  resize?: StoryblokImageResize;
  format?: StoryblokImageFormat;
  quality?: number;
  smart?: boolean;
  focus?: string;
  prefix?: string;
  host?: string;
}
