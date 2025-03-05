export function getStoryblokImageQuality(input: number): string {
  const quality = Math.floor(Math.max(0, Math.min(100, input)));
  return `quality(${quality})`;
}
