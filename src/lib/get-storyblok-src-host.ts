import { DEFAULT_HOST } from "./constants";

/**
 * Gets the host for Storyblok images. Defaults to "a.storyblok.com"
 * if no override is provided or STORYBLOK_IMAGE_LOADER_HOST environment
 * variable isn't set.
 * @param {string} override Manual override for the host
 * @returns
 */
export function getStoryblokSrcHost(override?: string): string {
  // Regex to match a hostname with an optional port
  const pattern = /^\w+(\.\w+)*(:\d+)?$/;

  // Return override if set and valid
  if (override && pattern.test(override)) {
    return override;
  }

  // Return environment variable if set and valid
  if (
    process.env.STORYBLOK_IMAGE_LOADER_HOST &&
    pattern.test(process.env.STORYBLOK_IMAGE_LOADER_HOST)
  ) {
    return process.env.STORYBLOK_IMAGE_LOADER_HOST;
  }

  // If no valid override or environment variable is provided, return default
  return DEFAULT_HOST;
}
