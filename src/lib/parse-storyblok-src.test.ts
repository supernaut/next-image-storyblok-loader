import { describe, expect, it } from "vitest";

import { parseStoryblokSrc } from "./parse-storyblok-src";

describe("parseStoryblokSrc", () => {
  describe("basic functionality", () => {
    it("should parse a basic Storyblok URL", () => {
      const src = "https://a.storyblok.com/f/123456/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
    });

    it("should parse URL with size information", () => {
      const src = "https://a.storyblok.com/f/123456/m/800x600/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.resize).toEqual({
        height: 600,
        width: 800,
      });
    });

    it("should parse URL with format and quality", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:format(webp):quality(80)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.format).toBe("webp");
      expect(result.quality).toBe(80);
    });

    it("should parse URL with focus parameter", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:focal(100x200:300x400)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.focus).toBe("100x200:300x400");
    });

    it("should parse URL with all parameters combined", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:format(webp):quality(90):focal(50x50:150x150)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.resize).toEqual({
        height: 600,
        width: 800,
      });
      expect(result.format).toBe("webp");
      expect(result.quality).toBe(90);
      expect(result.focus).toBe("50x50:150x150");
    });
  });

  describe("with custom host", () => {
    it("should use custom host when provided in options", () => {
      const src = "https://a.storyblok.com/f/123456/image.jpg";
      const result = parseStoryblokSrc(src, { host: "custom.storyblok.com" });

      expect(result.filename).toBe(
        "https://custom.storyblok.com/f/123456/image.jpg",
      );
    });
  });

  describe("edge cases", () => {
    it("should handle URLs without size information", () => {
      const src = "https://a.storyblok.com/f/123456/m/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.resize).toBeUndefined();
    });

    it("should handle URLs with invalid size format", () => {
      const src = "https://a.storyblok.com/f/123456/invalid/m/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456/invalid");
      expect(result.resize).toBeUndefined();
    });

    it("should handle URLs without filters", () => {
      const src = "https://a.storyblok.com/f/123456/m/800x600/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.format).toBeUndefined();
      expect(result.quality).toBeUndefined();
      expect(result.focus).toBeUndefined();
    });

    it("should handle partial filter parameters", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:format(png)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.format).toBe("png");
      expect(result.quality).toBeUndefined();
      expect(result.focus).toBeUndefined();
    });

    it("should ignore invalid quality values", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:quality(999)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.quality).toBeUndefined();
    });

    it("should ignore unsupported format values", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:format(svg)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.format).toBeUndefined();
    });

    it("should handle URL with m but no size before filters", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/filters:quality(80)/image.jpg";
      const result = parseStoryblokSrc(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.resize).toBeUndefined();
      expect(result.quality).toBe(80);
    });

    it("should handle URL without m but with filters (original asset with appended filters segment)", () => {
      const src =
        "https://a.storyblok.com/f/123456/filters:quality(80):format(webp)/image.jpg";
      const result = parseStoryblokSrc(src);

      // No transformation indicator so filename remains full path up to image.jpg (legacy behavior retains full asset path)
      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/filters:quality(80):format(webp)/image.jpg",
      );
      expect(result.quality).toBe(80);
      expect(result.format).toBe("webp");
    });
  });
});
