/* eslint-disable sonarjs/no-hardcoded-ip */
/* eslint-disable sonarjs/no-clear-text-protocols */
import { describe, expect, it } from "vitest";

import { imgSrcIsStoryblok } from "./img-src-is-storyblok";

describe("imgSrcIsStoryblok", () => {
  describe("with default host", () => {
    it("should return true for Storyblok URLs", () => {
      const storyblokUrl =
        "https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png";
      expect(imgSrcIsStoryblok(storyblokUrl)).toBe(true);
    });

    it("should return false for non-Storyblok URLs", () => {
      const externalUrl = "https://example.com/image.jpg";
      expect(imgSrcIsStoryblok(externalUrl)).toBe(false);
    });

    it("should return false for different subdomain of storyblok.com", () => {
      const differentSubdomain = "https://assets.storyblok.com/image.jpg";
      expect(imgSrcIsStoryblok(differentSubdomain)).toBe(false);
    });

    it("should return true for different protocol", () => {
      const httpUrl = "http://a.storyblok.com/f/88751/image.png";
      expect(imgSrcIsStoryblok(httpUrl)).toBe(true);
    });

    it("should return true for URLs with query parameters", () => {
      const urlWithQuery = "https://a.storyblok.com/f/88751/image.png?v=1";
      expect(imgSrcIsStoryblok(urlWithQuery)).toBe(true);
    });

    it("should return true for URLs with fragments", () => {
      const urlWithFragment =
        "https://a.storyblok.com/f/88751/image.png#section";
      expect(imgSrcIsStoryblok(urlWithFragment)).toBe(true);
    });
  });

  describe("with custom host", () => {
    it("should return true for custom host URLs", () => {
      const customUrl = "https://cdn.example.com/image.jpg";
      expect(imgSrcIsStoryblok(customUrl, "cdn.example.com")).toBe(true);
    });

    it("should return false for URLs not matching custom host", () => {
      const differentUrl = "https://other.example.com/image.jpg";
      expect(imgSrcIsStoryblok(differentUrl, "cdn.example.com")).toBe(false);
    });

    it("should return true for partial host matches", () => {
      const subdomainUrl = "https://api.cdn.example.com/image.jpg";
      expect(imgSrcIsStoryblok(subdomainUrl, "cdn.example.com")).toBe(true);
    });

    it("should handle localhost correctly", () => {
      const localhostUrl = "http://localhost:3000/image.jpg";
      expect(imgSrcIsStoryblok(localhostUrl, "localhost")).toBe(true);
    });

    it("should handle IP addresses", () => {
      const ipUrl = "http://192.168.1.1:8080/image.jpg";
      expect(imgSrcIsStoryblok(ipUrl, "192.168.1.1")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle URLs with port numbers", () => {
      const urlWithPort = "https://a.storyblok.com:443/f/88751/image.png";
      expect(imgSrcIsStoryblok(urlWithPort)).toBe(true);
    });

    it("should handle uppercase domains (domains are case-insensitive)", () => {
      const uppercaseUrl = "https://A.STORYBLOK.COM/image.jpg";
      expect(imgSrcIsStoryblok(uppercaseUrl)).toBe(true);
    });

    it("should handle relative URLs by throwing error", () => {
      expect(() => imgSrcIsStoryblok("/relative/path/image.jpg")).toThrow();
    });

    it("should handle malformed URLs by throwing error", () => {
      expect(() => imgSrcIsStoryblok("not-a-url")).toThrow();
    });
  });
});
