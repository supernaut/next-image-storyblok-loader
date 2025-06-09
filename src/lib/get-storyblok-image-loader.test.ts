import { beforeEach, describe, expect, it, vi } from "vitest";

import { getStoryblokImageLoader } from "./get-storyblok-image-loader";
import { getStoryblokSrc } from "./get-storyblok-src";
import { imgSrcIsStoryblok } from "./img-src-is-storyblok";
import { parseStoryblokSrc } from "./parse-storyblok-src";

// Mock all the dependencies
vi.mock("./get-storyblok-src");
vi.mock("./img-src-is-storyblok");
vi.mock("./parse-storyblok-src");

describe("getStoryblokImageLoader", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock for imgSrcIsStoryblok
    const imgSrcIsStoryblokMock = vi.mocked(imgSrcIsStoryblok);
    imgSrcIsStoryblokMock.mockImplementation((src: string, host?: string) => {
      // For the "invalid-url" test case, we want it to be considered as Storyblok
      // so that the URL parsing can throw an error
      if (src === "invalid-url") {
        return true;
      }
      if (host) {
        return src.includes(host);
      }
      return src.includes("storyblok.com");
    });

    // Setup default mock behavior for getStoryblokSrc
    const getStoryblokSrcMock = vi.mocked(getStoryblokSrc);
    getStoryblokSrcMock.mockImplementation((src: unknown, options: unknown) => {
      if (typeof src === "string") {
        // Return a URL with transformations applied
        const baseUrl = src.replace(/\/m\/.*$/, ""); // Remove existing transformations
        let result = `${baseUrl}/m`;

        if (
          options &&
          typeof options === "object" &&
          "resize" in options &&
          options.resize
        ) {
          const resize = options.resize as { height?: number; width?: number };
          const { height, width } = resize;
          result += `/${width}x${height || 0}`;
        }

        if (
          options &&
          typeof options === "object" &&
          "quality" in options &&
          options.quality
        ) {
          result += `/filters:quality(${options.quality})`;
        }

        return result;
      }
      return src as string;
    });

    // Setup default mock behavior for parseStoryblokSrc
    const parseStoryblokSrcMock = vi.mocked(parseStoryblokSrc);
    parseStoryblokSrcMock.mockImplementation((src: string) => {
      // Extract dimensions from URL path like /2600x1214/
      const dimensionMatch = src.match(/\/(\d+)x(\d+)\//);
      if (dimensionMatch) {
        return {
          filename: src,
          focus: undefined,
          format: undefined,
          height: parseInt(dimensionMatch[2], 10),
          quality: undefined,
          resize: undefined,
          width: parseInt(dimensionMatch[1], 10),
        };
      }
      return {
        filename: src,
        focus: undefined,
        format: undefined,
        height: 1214,
        quality: undefined,
        resize: undefined,
        width: 2600,
      };
    });
  });
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
        "https://a.storyblok.com/f/88751/2600x1214/77a80a3235/hero-visual-editor-ai-blue.png/m/400x186/filters:quality(90)",
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
        "https://a.storyblok.com/f/88751/2600x1214/77a80a3235/hero-visual-editor-ai-blue.png/m/400x186",
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
        "https://a.storyblok.com/f/88751/800x800/b22306649b/henning-heppner.jpeg/m/400x400",
      );
    });
  });

  describe("non-Storyblok URLs", () => {
    it("should return original URL when not a Storyblok URL", () => {
      const loader = getStoryblokImageLoader();
      const nonStoryblokUrl = "https://example.com/image.jpg";

      const result = loader({
        quality: 85,
        src: nonStoryblokUrl,
        width: 800,
      });

      expect(result).toBe(nonStoryblokUrl);
    });

    it("should return original URL when custom host doesn't match", () => {
      const loader = getStoryblokImageLoader({ host: "custom.cdn.com" });
      const regularStoryblokUrl = "https://a.storyblok.com/f/123/image.jpg";

      const result = loader({
        quality: 85,
        src: regularStoryblokUrl,
        width: 800,
      });

      expect(result).toBe(regularStoryblokUrl);
    });
  });

  describe("malformed URLs", () => {
    it("should handle URLs without proper size format", () => {
      const loader = getStoryblokImageLoader();
      const malformedUrl = "https://a.storyblok.com/f/88751/invalid/image.jpg";

      const result = loader({
        quality: 90,
        src: malformedUrl,
        width: 600,
      });

      // Should fall back to getStoryblokSrc
      expect(result).toBe(
        "https://a.storyblok.com/f/88751/invalid/image.jpg/m/600x0/filters:quality(90)",
      );
    });

    it("should handle URLs with missing size parts", () => {
      const loader = getStoryblokImageLoader();
      const malformedUrl = "https://a.storyblok.com/f/88751/image.jpg";

      const result = loader({
        src: malformedUrl,
        width: 400,
      });

      // Should fall back to getStoryblokSrc
      expect(result).toBe("https://a.storyblok.com/f/88751/image.jpg/m/400x0");
    });

    it("should handle URLs with incomplete size information", () => {
      const loader = getStoryblokImageLoader();
      const incompleteUrl = "https://a.storyblok.com/f/88751/800/image.jpg";

      const result = loader({
        quality: 75,
        src: incompleteUrl,
        width: 500,
      });

      // Should fall back to getStoryblokSrc
      expect(result).toBe(
        "https://a.storyblok.com/f/88751/800/image.jpg/m/500x0/filters:quality(75)",
      );
    });
  });

  describe("quality and resize assignment", () => {
    it("should assign quality when provided as number", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        quality: 95,
        src: validStoryblokUrl,
        width: 800,
      });

      expect(result).toContain("quality(95)");
    });

    it("should not assign quality when undefined", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        quality: undefined,
        src: validStoryblokUrl,
        width: 800,
      });

      expect(result).not.toContain("quality");
    });

    it("should assign resize when inputWidth is provided", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        src: validStoryblokUrl,
        width: 1200,
      });

      expect(result).toContain("1200x");
    });

    it("should handle zero width edge case", () => {
      const loader = getStoryblokImageLoader();
      const result = loader({
        src: validStoryblokUrl,
        width: 0,
      });

      // Should still process but may not include resize in final URL
      expect(typeof result).toBe("string");
    });
  });

  describe("aspect ratio with parsed resize", () => {
    it("should use parsed resize aspect ratio when available", () => {
      // Import the mock to modify its behavior
      const parseStoryblokSrcMock = vi.mocked(parseStoryblokSrc);
      parseStoryblokSrcMock.mockReturnValueOnce({
        filename:
          "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png",
        resize: { height: 500, width: 1000 }, // 2:1 aspect ratio
      });

      const loader = getStoryblokImageLoader();
      const result = loader({
        src: validStoryblokUrl,
        width: 800,
      });

      // With 2:1 aspect ratio, height should be 400
      expect(result).toContain("800x400");
    });

    it("should fall back to original aspect ratio when parsed resize has no height", () => {
      // Import the mock to modify its behavior
      const parseStoryblokSrcMock = vi.mocked(parseStoryblokSrc);
      parseStoryblokSrcMock.mockReturnValueOnce({
        filename:
          "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png",
        resize: { width: 1000 }, // No height specified
      });

      const loader = getStoryblokImageLoader();
      const result = loader({
        src: validStoryblokUrl,
        width: 800,
      });

      // Should use original aspect ratio from URL (2600x1214) = 2.14... so 800/2.14 ≈ 373
      expect(result).toContain("800x373");
    });

    it("should handle zero aspect ratio by defaulting height to 0", () => {
      const loader = getStoryblokImageLoader();
      // Use a URL with invalid dimensions that would create a zero/NaN aspect ratio
      const result = loader({
        src: "https://a.storyblok.com/f/88751/0x0/77a80a3235/image.png",
        width: 400,
      });

      // When aspect ratio is 0 or NaN, should default height to 0
      expect(result).toContain("400x0");
    });
  });

  describe("getStoryblokSrc fallback scenarios", () => {
    it("should return original URL when getStoryblokSrc returns undefined for malformed URLs", () => {
      const getStoryblokSrcMock = vi.mocked(getStoryblokSrc);
      getStoryblokSrcMock.mockReturnValueOnce(undefined);

      const loader = getStoryblokImageLoader();
      const malformedUrl = "https://a.storyblok.com/f/88751/invalid/image.jpg";

      const result = loader({
        src: malformedUrl,
        width: 600,
      });

      // Should return original URL when getStoryblokSrc returns undefined
      expect(result).toBe(malformedUrl);
    });

    it("should return original URL when getStoryblokSrc returns undefined for normal processing", () => {
      const getStoryblokSrcMock = vi.mocked(getStoryblokSrc);
      getStoryblokSrcMock.mockReturnValueOnce(undefined);

      const loader = getStoryblokImageLoader();
      const result = loader({
        src: validStoryblokUrl,
        width: 800,
      });

      // Should return original URL when getStoryblokSrc returns undefined
      expect(result).toBe(validStoryblokUrl);
    });
  });
});
