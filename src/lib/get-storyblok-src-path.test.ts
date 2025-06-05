import { describe, expect, it } from "vitest";

import { getStoryblokSrcPath } from "./get-storyblok-src-path";

describe("getStoryblokSrcPath", () => {
  it("should extract the path up to the file ID from a Storyblok URL", () => {
    const src = "https://a.storyblok.com/f/123456/image.jpg";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456/image.jpg");
  });

  it("should handle URLs with subdirectories", () => {
    const src = "https://a.storyblok.com/f/123456/subfolder/image.jpg";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456/subfolder/image.jpg");
  });

  it("should handle URLs with query parameters", () => {
    const src = "https://a.storyblok.com/f/123456/image.jpg?quality=80";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456/image.jpg");
  });

  it("should handle URLs with fragments", () => {
    const src = "https://a.storyblok.com/f/123456/image.jpg#section";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456/image.jpg");
  });

  it("should handle URLs with transformation parameters", () => {
    const src = "https://a.storyblok.com/f/123456/m/800x600/image.jpg";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456/m/800x600/image.jpg");
  });

  it("should handle short URLs with minimal path segments", () => {
    const src = "https://a.storyblok.com/f/123456";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456");
  });

  it("should handle custom domains", () => {
    const src = "https://custom.domain.com/f/123456/image.jpg";
    const result = getStoryblokSrcPath(src);

    expect(result).toBe("/f/123456/image.jpg");
  });

  it("should throw for invalid URLs", () => {
    expect(() => {
      getStoryblokSrcPath("not-a-url");
    }).toThrow("Invalid URL");
  });
});
