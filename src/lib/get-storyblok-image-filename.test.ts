import { describe, expect, it } from "vitest";

import type { AssetStoryblok } from "../types/asset-storyblok";

import { getStoryblokImageFilename } from "./get-storyblok-image-filename";

describe("getStoryblokImageFilename", () => {
  describe("with string input", () => {
    it("should handle basic URL string", () => {
      const src = "https://a.storyblok.com/f/123456/image.jpg";
      const result = getStoryblokImageFilename(src);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options).toEqual({});
    });

    it("should parse options from URL string", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:format(webp):quality(80)/image.jpg";
      const result = getStoryblokImageFilename(src);

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.options.format).toBe("webp");
      expect(result.options.quality).toBe(80);
      expect(result.options.resize).toEqual({
        height: 600,
        width: 800,
      });
    });

    it("should merge existing options with parsed options", () => {
      const src =
        "https://a.storyblok.com/f/123456/m/800x600/filters:format(webp)/image.jpg";
      const result = getStoryblokImageFilename(src, { quality: 90 });

      expect(result.filename).toBe("https://a.storyblok.com/f/123456");
      expect(result.options.format).toBe("webp");
      expect(result.options.quality).toBe(90);
      expect(result.options.resize).toEqual({
        height: 600,
        width: 800,
      });
    });
  });

  describe("with AssetStoryblok input", () => {
    it("should handle AssetStoryblok object with filename", () => {
      const asset: AssetStoryblok = {
        alt: "Test image",
        filename: "https://a.storyblok.com/f/123456/image.jpg",
      };
      const result = getStoryblokImageFilename(asset);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options).toEqual({});
    });

    it("should handle AssetStoryblok object with focus", () => {
      const asset: AssetStoryblok = {
        alt: "Test image",
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        focus: "100x100:200x200",
      };
      const result = getStoryblokImageFilename(asset);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options.focus).toBe("100x100:200x200");
    });

    it("should merge AssetStoryblok focus with existing options", () => {
      const asset: AssetStoryblok = {
        alt: "Test image",
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        focus: "100x100:200x200",
      };
      const result = getStoryblokImageFilename(asset, { quality: 80 });

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options.focus).toBe("100x100:200x200");
      expect(result.options.quality).toBe(80);
    });

    it("should handle AssetStoryblok object without filename", () => {
      const asset: AssetStoryblok = {
        alt: "Test image",
        focus: "100x100:200x200",
      };
      const result = getStoryblokImageFilename(asset);

      expect(result.filename).toBe("");
      expect(result.options.focus).toBe("100x100:200x200");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined input", () => {
      const result = getStoryblokImageFilename(undefined);

      expect(result.filename).toBe("");
      expect(result.options).toEqual({});
    });

    it("should handle null options", () => {
      const src = "https://a.storyblok.com/f/123456/image.jpg";
      const result = getStoryblokImageFilename(src, null);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options).toEqual({});
    });

    it("should handle empty string input", () => {
      expect(() => getStoryblokImageFilename("")).toThrow("Invalid URL");
    });
  });
});
