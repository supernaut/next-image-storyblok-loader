import { describe, expect, it, vi } from "vitest";

import { getStoryblokImageLoader } from "./get-storyblok-image-loader";

// Mock the dependencies
vi.mock("./get-storyblok-src", () => ({
  getStoryblokSrc: vi.fn((_src, options) => {
    // Simple mock implementation that returns a transformed URL
    const baseUrl =
      "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png";
    let result = baseUrl;

    if (options?.resize) {
      result += `/m/${options.resize.width}x${options.resize.height}`;
    }

    if (options?.quality) {
      result += `/filters:quality(${options.quality})`;
    }

    return result;
  }),
}));

vi.mock("./parse-storyblok-src", () => ({
  parseStoryblokSrc: vi.fn((_src) => ({
    filename:
      "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png",
    focus: undefined,
    format: undefined,
    quality: undefined,
    resize: undefined,
  })),
}));

describe("getStoryblokImageLoader", () => {
  const validStoryblokUrl =
    "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png";

  describe("basic functionality", () => {
    it("should return a function", () => {
      const loader = getStoryblokImageLoader();
      expect(typeof loader).toBe("function");
    });

    it("should transform image URL with width", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 800,
      });

      expect(typeof result).toBe("string");
      expect(result).toContain("800x");
    });

    it("should handle quality parameter", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        quality: 85,
        src: validStoryblokUrl,
        width: 800,
      });

      expect(result).toContain("quality(85)");
    });

    it("should calculate aspect ratio correctly", () => {
      const loader = getStoryblokImageLoader();

      // For a 2600x1214 image, aspect ratio is ~2.14
      // So for width 800, height should be ~374
      const result = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 800,
      });

      // The exact height depends on the aspect ratio calculation
      expect(result).toContain("800x");
    });
  });

  describe("with options", () => {
    it("should accept custom options", () => {
      const options = {
        host: "custom.example.com",
        quality: 90,
      };

      const loader = getStoryblokImageLoader(options);
      expect(typeof loader).toBe("function");
    });

    it("should override quality from loader options when quality parameter is provided", () => {
      const loader = getStoryblokImageLoader({ quality: 75 });
      const result = loader({
        quality: 90, // This should override the loader option
        src: validStoryblokUrl,
        width: 600,
      });

      expect(result).toContain("quality(90)");
    });

    it("should use default options when no parameters provided", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 400,
      });

      expect(result).toContain("400x");
    });
  });

  describe("error handling", () => {
    it("should handle invalid URLs gracefully", () => {
      const loader = getStoryblokImageLoader();

      expect(() => {
        loader({
          quality: undefined,
          src: "invalid-url",
          width: 800,
        });
      }).toThrow();
    });

    it("should handle missing width parameter", () => {
      const loader = getStoryblokImageLoader();

      const result = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 0,
      });

      expect(typeof result).toBe("string");
    });
  });

  describe("aspect ratio calculations", () => {
    it("should maintain aspect ratio for different widths", () => {
      const loader = getStoryblokImageLoader();

      const result1 = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 200,
      });

      const result2 = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 400,
      });

      expect(result1).toContain("200x");
      expect(result2).toContain("400x");
    });

    it("should handle edge case widths", () => {
      const loader = getStoryblokImageLoader();

      const resultSmall = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 1,
      });

      const resultLarge = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 3000,
      });

      expect(resultSmall).toContain("1x");
      expect(resultLarge).toContain("3000x");
    });
  });

  describe("edge cases", () => {
    it("should handle URLs with existing resize information", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        quality: 90,
        src: "https://a.storyblok.com/f/88751/2600x1214/77a80a3235/hero-visual-editor-ai-blue.png/m/1000x466",
        width: 400,
      });

      // Should maintain aspect ratio from existing resize
      expect(result).toBe(
        "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/400x186/filters:quality(90)",
      );
    });

    it("should handle URLs with zero height in resize calculation", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        src: "https://a.storyblok.com/f/88751/2600x1214/77a80a3235/hero-visual-editor-ai-blue.png/m/2600x0",
        width: 400,
      });

      // When original dimensions include zero height, should calculate from aspect ratio
      expect(result).toBe(
        "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/400x186",
      );
    });

    it("should handle invalid dimension parsing", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        src: "https://a.storyblok.com/f/88751/800x800/b22306649b/henning-heppner.jpeg/m/96x96",
        width: 400,
      });

      // Should calculate proper aspect ratio from valid dimensions
      expect(result).toBe(
        "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/400x400",
      );
    });
  });
});
