import { describe, expect, it } from "vitest";

import type { AssetStoryblok } from "../types/asset-storyblok";

import { getStoryblokSrc } from "./get-storyblok-src";

describe("getStoryblokSrc", () => {
  describe("with AssetStoryblok input", () => {
    it("should generate URL from AssetStoryblok object", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset);

      expect(result).toBe("https://a.storyblok.com/f/123456/image.jpg/m");
    });

    it("should generate URL with resize options", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset, {
        resize: { height: 600, width: 800 },
      });

      expect(result).toBe(
        "https://a.storyblok.com/f/123456/image.jpg/m/800x600/smart",
      );
    });

    it("should generate URL with format and quality options", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset, {
        format: "webp",
        quality: 90,
      });

      expect(result).toBe(
        "https://a.storyblok.com/f/123456/image.jpg/m/filters:format(webp):quality(90)",
      );
    });

    it("should generate URL with all options", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset, {
        focus: "50x50:150x150",
        format: "webp",
        quality: 90,
        resize: { height: 600, width: 800 },
      });

      expect(result).toBe(
        "https://a.storyblok.com/f/123456/image.jpg/m/800x600/smart/filters:format(webp):quality(90):focal(50x50:150x150)",
      );
    });

    it("should return undefined for AssetStoryblok without filename", () => {
      const asset: AssetStoryblok = {
        filename: "",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset);

      expect(result).toBeUndefined();
    });

    it("should use asset focus when no focus option provided", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        focus: "100x100:200x200",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset, {
        resize: { height: 600, width: 800 },
      });

      expect(result).toBe(
        "https://a.storyblok.com/f/123456/image.jpg/m/800x600/smart/filters:focal(100x100:200x200)",
      );
    });
  });

  describe("with string input", () => {
    it("should return the string URL as-is when it's a Storyblok URL", () => {
      const url = "https://a.storyblok.com/f/123456/image.jpg";

      const result = getStoryblokSrc(url);

      expect(result).toBe("https://a.storyblok.com/f/123456/image.jpg/m");
    });

    it("should process Storyblok URL with options", () => {
      const url = "https://a.storyblok.com/f/123456/image.jpg";

      const result = getStoryblokSrc(url, {
        format: "webp",
        resize: { width: 400 },
      });

      expect(result).toBe(
        "https://a.storyblok.com/f/123456/image.jpg/m/400x0/smart/filters:format(webp)",
      );
    });

    it("should return non-Storyblok URL as-is", () => {
      const url = "https://example.com/image.jpg";

      const result = getStoryblokSrc(url);

      expect(result).toBe("https://example.com/image.jpg");
    });

    it("should return non-Storyblok URL as-is even with options", () => {
      const url = "https://example.com/image.jpg";

      const result = getStoryblokSrc(url, {
        format: "webp",
        resize: { width: 400 },
      });

      expect(result).toBe("https://example.com/image.jpg");
    });
  });

  describe("edge cases", () => {
    it("should return undefined for undefined input", () => {
      const result = getStoryblokSrc(undefined);

      expect(result).toBeUndefined();
    });

    it("should handle null options", () => {
      const url = "https://a.storyblok.com/f/123456/image.jpg";

      const result = getStoryblokSrc(url, null);

      expect(result).toBe("https://a.storyblok.com/f/123456/image.jpg/m");
    });

    it("should handle AssetStoryblok with undefined filename", () => {
      const asset: AssetStoryblok = {
        filename: undefined as unknown as string,
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset);

      expect(result).toBeUndefined();
    });

    it("should handle prefix option", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset, {
        prefix: "/custom-prefix",
        resize: { height: 600, width: 800 },
      });

      expect(result).toBe("/custom-prefix/f/123456/image.jpg/m/800x600/smart");
    });

    it("should handle prefix with double slashes", () => {
      const asset: AssetStoryblok = {
        filename: "https://a.storyblok.com/f/123456/image.jpg",
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset, {
        prefix: "/custom-prefix/",
      });

      expect(result).toBe("/custom-prefix/f/123456/image.jpg/m");
    });

    it("should prioritize prefix option over environment variable", () => {
      const originalEnv = process.env.STORYBLOK_IMAGE_LOADER_PREFIX;
      process.env.STORYBLOK_IMAGE_LOADER_PREFIX = "/env-prefix";

      try {
        const asset: AssetStoryblok = {
          filename: "https://a.storyblok.com/f/123456/image.jpg",
          id: 123456,
          name: "image.jpg",
        };

        const result = getStoryblokSrc(asset, {
          prefix: "/option-prefix",
        });

        expect(result).toBe("/option-prefix/f/123456/image.jpg/m");
      } finally {
        if (originalEnv !== undefined) {
          process.env.STORYBLOK_IMAGE_LOADER_PREFIX = originalEnv;
        } else {
          delete process.env.STORYBLOK_IMAGE_LOADER_PREFIX;
        }
      }
    });

    it("should use environment variable when no prefix option provided", () => {
      const originalEnv = process.env.STORYBLOK_IMAGE_LOADER_PREFIX;
      process.env.STORYBLOK_IMAGE_LOADER_PREFIX = "/env-prefix";

      try {
        const asset: AssetStoryblok = {
          filename: "https://a.storyblok.com/f/123456/image.jpg",
          id: 123456,
          name: "image.jpg",
        };

        const result = getStoryblokSrc(asset);

        expect(result).toBe("/env-prefix/f/123456/image.jpg/m");
      } finally {
        if (originalEnv !== undefined) {
          process.env.STORYBLOK_IMAGE_LOADER_PREFIX = originalEnv;
        } else {
          delete process.env.STORYBLOK_IMAGE_LOADER_PREFIX;
        }
      }
    });

    it("should fail when asset lacks filename value", () => {
      const asset: Partial<AssetStoryblok> = {
        id: 123456,
        name: "image.jpg",
      };

      const result = getStoryblokSrc(asset as AssetStoryblok);

      expect(result).toBe(undefined);
    });
  });
});
