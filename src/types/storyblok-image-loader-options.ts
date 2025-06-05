import type { StoryblokImageResize } from "./storyblok-image-resize";
import type { StoryblokImageFormat } from "./storyblok-image-format";

export type StoryblokImageLoaderOptions = {
  resize?: StoryblokImageResize;
  format?: StoryblokImageFormat;
  quality?: number;
  smart?: boolean;
  focus?: string;
  prefix?: string;
  host?: string;
};

export const StoryblokImageLoaderOptionsKeys: string[] = [
  "resize",
  "format",
  "quality",
  "smart",
  "focus",
  "prefix",
  "host",
];
