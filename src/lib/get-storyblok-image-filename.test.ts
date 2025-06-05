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
      const asset: Partial<AssetStoryblok> = {
        alt: "Test image",
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        name: "image.jpg",
      };
      const result = getStoryblokImageFilename(asset as AssetStoryblok);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options).toEqual({});
    });

    it("should handle AssetStoryblok object with focus", () => {
      const asset: Partial<AssetStoryblok> = {
        alt: "Test image",
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        focus: "100x100:200x200",
      };
      const result = getStoryblokImageFilename(asset as AssetStoryblok);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options.focus).toBe("100x100:200x200");
    });

    it("should merge AssetStoryblok focus with existing options", () => {
      const asset: Partial<AssetStoryblok> = {
        alt: "Test image",
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        focus: "100x100:200x200",
      };
      const result = getStoryblokImageFilename(asset as AssetStoryblok, {
        quality: 80,
      });

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/123456/image.jpg",
      );
      expect(result.options.focus).toBe("100x100:200x200");
      expect(result.options.quality).toBe(80);
    });

    it("should handle AssetStoryblok object without filename", () => {
      const asset: Partial<AssetStoryblok> = {
        alt: "Test image",
        focus: "100x100:200x200",
      };
      const result = getStoryblokImageFilename(asset as AssetStoryblok);

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

    it("should handle string URL with resize information", () => {
      const src =
        "https://a.storyblok.com/f/88751/2600x1214/77a80a3235/hero-visual-editor-ai-blue.png/m/2600x0/";
      const result = getStoryblokImageFilename(src);

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/88751/2600x1214/77a80a3235/hero-visual-editor-ai-blue.png",
      );
      expect(result.options.resize).toEqual({ height: 0, width: 2600 });
    });

    it("should preserve existing options when parsing string URL with resize", () => {
      const src =
        "https://a.storyblok.com/f/88751/1667x1114/3af9f04f81/nrf-cs-masked.png/m/1667x0/";
      const result = getStoryblokImageFilename(src, { quality: 90 });

      expect(result.filename).toBe(
        "https://a.storyblok.com/f/88751/1667x1114/3af9f04f81/nrf-cs-masked.png",
      );
      expect(result.options.resize).toEqual({ height: 0, width: 1667 });
      expect(result.options.quality).toBe(90);
    });
  });
});
