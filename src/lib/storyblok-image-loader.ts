import type { ImageLoader } from "next/image";
import { getStoryblokImageLoader } from "./get-storyblok-image-loader";

/**
 * Storyblok image loader for Next.js Image component with default options.
 */
export const storyblokImageLoader: ImageLoader = getStoryblokImageLoader();
