import { describe, expect, it } from "vitest";

import { getStoryblokImageSize } from "./get-storyblok-image-size";
import { STORYBLOK_IMAGE_SIZE_LIMIT } from "./storyblok-image-size-limit";

describe("getStoryblokImageSize", () => {
  it("should return undefined when width is 0", () => {
    const resize = { height: 600, width: 0 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBeUndefined();
  });

  it("should return undefined when width is not provided", () => {
    const resize = { height: 600 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBeUndefined();
  });

  it("should return width x height for normal dimensions", () => {
    const resize = { height: 600, width: 800 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe("800x600");
  });

  it("should return width x 0 when height is not provided", () => {
    const resize = { width: 800 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe("800x0");
  });

  it("should limit width when it exceeds size limit and is larger than height", () => {
    const resize = { height: 600, width: STORYBLOK_IMAGE_SIZE_LIMIT + 100 };
    const result = getStoryblokImageSize(resize);

    const expectedHeight = Math.floor(
      (600 / (STORYBLOK_IMAGE_SIZE_LIMIT + 100)) * STORYBLOK_IMAGE_SIZE_LIMIT,
    );
    expect(result).toBe(`${STORYBLOK_IMAGE_SIZE_LIMIT}x${expectedHeight}`);
  });

  it("should limit width when it exceeds size limit and height is 0", () => {
    const resize = { height: 0, width: STORYBLOK_IMAGE_SIZE_LIMIT + 100 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe(`${STORYBLOK_IMAGE_SIZE_LIMIT}x0`);
  });

  it("should limit width when it exceeds size limit and no height is provided", () => {
    const resize = { width: STORYBLOK_IMAGE_SIZE_LIMIT + 100 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe(`${STORYBLOK_IMAGE_SIZE_LIMIT}x0`);
  });

  it("should limit height when it exceeds size limit and is larger than width", () => {
    const resize = { height: STORYBLOK_IMAGE_SIZE_LIMIT + 100, width: 600 };
    const result = getStoryblokImageSize(resize);

    const expectedWidth = Math.floor(
      (600 / (STORYBLOK_IMAGE_SIZE_LIMIT + 100)) * STORYBLOK_IMAGE_SIZE_LIMIT,
    );
    expect(result).toBe(`${expectedWidth}x${STORYBLOK_IMAGE_SIZE_LIMIT}`);
  });

  it("should not limit height when height is undefined", () => {
    const resize = { width: 600 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe("600x0");
  });

  it("should handle equal width and height at the limit", () => {
    const resize = {
      height: STORYBLOK_IMAGE_SIZE_LIMIT,
      width: STORYBLOK_IMAGE_SIZE_LIMIT,
    };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe(
      `${STORYBLOK_IMAGE_SIZE_LIMIT}x${STORYBLOK_IMAGE_SIZE_LIMIT}`,
    );
  });

  it("should handle width larger than height but both under limit", () => {
    const resize = { height: 500, width: 1000 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe("1000x500");
  });

  it("should handle height larger than width but both under limit", () => {
    const resize = { height: 1000, width: 500 };
    const result = getStoryblokImageSize(resize);

    expect(result).toBe("500x1000");
  });
});
