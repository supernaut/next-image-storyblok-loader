import type { StoryblokImageResize } from "../types/storyblok-image-resize";

import { STORYBLOK_IMAGE_SIZE_LIMIT } from "./storyblok-image-size-limit";

export function getStoryblokImageSize(
  resize: StoryblokImageResize,
): string | undefined {
  if (!resize.width) {
    return;
  }

  let { height = 0, width } = resize;

  if (width > height && width > STORYBLOK_IMAGE_SIZE_LIMIT) {
    width = STORYBLOK_IMAGE_SIZE_LIMIT;
    height = resize.height
      ? Math.floor((resize.height / resize.width) * width)
      : 0;
  }
  if (resize.height && height > width && height > STORYBLOK_IMAGE_SIZE_LIMIT) {
    height = STORYBLOK_IMAGE_SIZE_LIMIT;
    width = Math.floor((resize.width / resize.height) * height);
  }
  return `${width}x${height}`;
}
