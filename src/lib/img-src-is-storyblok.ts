import { DEFAULT_HOST } from "./constants";

export function imgSrcIsStoryblok(
  src: string,
  host: string = DEFAULT_HOST,
): boolean {
  const url = new URL(src);
  return url.host.includes(host);
}
