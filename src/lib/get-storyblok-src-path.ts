export function getStoryblokSrcPath(src: string): string {
  const url = new URL(src);
  const parts = url.pathname.split("/");
  return parts.slice(0, 6).join("/");
}
