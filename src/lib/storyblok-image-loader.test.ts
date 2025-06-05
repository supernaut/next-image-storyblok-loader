import { describe, expect, it } from "vitest";

import { storyblokImageLoader } from "./storyblok-image-loader";

describe("storyblokImageLoader", () => {
  it("should be a function", () => {
    expect(typeof storyblokImageLoader).toBe("function");
  });

  it("should process Storyblok URLs with width", () => {
    const result = storyblokImageLoader({
      src: "https://a.storyblok.com/f/123456/image.jpg",
      width: 800,
    });

    expect(result).toBe(
      "https://a.storyblok.com/f/123456/image.jpg/m/800x0/smart",
    );
  });

  it("should process Storyblok URLs with width and quality", () => {
    const result = storyblokImageLoader({
      quality: 90,
      src: "https://a.storyblok.com/f/123456/image.jpg",
      width: 800,
    });

    expect(result).toBe(
      "https://a.storyblok.com/f/123456/image.jpg/m/800x0/smart/filters:quality(90)",
    );
  });

  it("should return non-Storyblok URLs as-is", () => {
    const src = "https://example.com/image.jpg";

    const result = storyblokImageLoader({
      quality: 90,
      src,
      width: 800,
    });

    expect(result).toBe(src);
  });

  it("should handle URLs without protocol", () => {
    expect(() => {
      storyblokImageLoader({
        src: "//a.storyblok.com/f/123456/image.jpg",
        width: 600,
      });
    }).toThrow("Invalid URL");
  });

  it("should handle width of 0", () => {
    const result = storyblokImageLoader({
      quality: 90,
      src: "https://a.storyblok.com/f/123456/image.jpg",
      width: 0,
    });

    expect(result).toBe(
      "https://a.storyblok.com/f/123456/image.jpg/m/smart/filters:quality(90)",
    );
  });
});
