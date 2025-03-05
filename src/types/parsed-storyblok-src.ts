import type { StoryblokImageFormat } from "./storyblok-image-format";
import type { StoryblokImageResize } from "./storyblok-image-resize";

export interface ParsedStoryblokSrc {
  filename: string;
  quality?: number;
  format?: StoryblokImageFormat;
  focus?: string;
  resize?: StoryblokImageResize;
}
