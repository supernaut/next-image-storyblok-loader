/* eslint-disable sonarjs/no-hardcoded-ip */
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_HOST } from "./constants";
import { getStoryblokSrcHost } from "./get-storyblok-src-host";

describe("getStoryblokSrcHost", () => {
  // Store original env to restore later
  const originalEnv = process.env.STORYBLOK_IMAGE_LOADER_HOST;

  beforeEach(() => {
    // Clear environment variable before each test
    delete process.env.STORYBLOK_IMAGE_LOADER_HOST;
  });

  afterEach(() => {
    // Restore original environment
    if (originalEnv !== undefined) {
      process.env.STORYBLOK_IMAGE_LOADER_HOST = originalEnv;
    } else {
      delete process.env.STORYBLOK_IMAGE_LOADER_HOST;
    }
  });

  describe("when no override or environment variable is provided", () => {
    it("should return the default host", () => {
      const result = getStoryblokSrcHost();
      expect(result).toBe(DEFAULT_HOST);
    });
  });

  describe("when override parameter is provided", () => {
    it("should return the override when it is valid", () => {
      const validHost = "custom.example.com";
      const result = getStoryblokSrcHost(validHost);
      expect(result).toBe(validHost);
    });

    it("should return the override with port when valid", () => {
      const validHostWithPort = "custom.example.com:8080";
      const result = getStoryblokSrcHost(validHostWithPort);
      expect(result).toBe(validHostWithPort);
    });

    it("should return default host when override is invalid (contains spaces)", () => {
      const invalidHost = "invalid host.com";
      const result = getStoryblokSrcHost(invalidHost);
      expect(result).toBe(DEFAULT_HOST);
    });

    it("should return default host when override is invalid (contains special chars)", () => {
      const invalidHost = "invalid@host.com";
      const result = getStoryblokSrcHost(invalidHost);
      expect(result).toBe(DEFAULT_HOST);
    });

    it("should return default host when override is empty string", () => {
      const result = getStoryblokSrcHost("");
      expect(result).toBe(DEFAULT_HOST);
    });

    it("should return default host when override contains protocol", () => {
      const invalidHost = "https://example.com";
      const result = getStoryblokSrcHost(invalidHost);
      expect(result).toBe(DEFAULT_HOST);
    });

    it("should handle localhost correctly", () => {
      const localhost = "localhost";
      const result = getStoryblokSrcHost(localhost);
      expect(result).toBe(localhost);
    });

    it("should handle localhost with port correctly", () => {
      const localhostWithPort = "localhost:3000";
      const result = getStoryblokSrcHost(localhostWithPort);
      expect(result).toBe(localhostWithPort);
    });
  });

  describe("when environment variable is set", () => {
    it("should return environment variable when valid and no override provided", () => {
      const envHost = "env.example.com";
      process.env.STORYBLOK_IMAGE_LOADER_HOST = envHost;

      const result = getStoryblokSrcHost();
      expect(result).toBe(envHost);
    });

    it("should return environment variable with port when valid", () => {
      const envHostWithPort = "env.example.com:9000";
      process.env.STORYBLOK_IMAGE_LOADER_HOST = envHostWithPort;

      const result = getStoryblokSrcHost();
      expect(result).toBe(envHostWithPort);
    });

    it("should return default host when environment variable is invalid", () => {
      process.env.STORYBLOK_IMAGE_LOADER_HOST = "invalid env host";

      const result = getStoryblokSrcHost();
      expect(result).toBe(DEFAULT_HOST);
    });

    it("should prefer override over environment variable when both are provided", () => {
      const envHost = "env.example.com";
      const overrideHost = "override.example.com";
      process.env.STORYBLOK_IMAGE_LOADER_HOST = envHost;

      const result = getStoryblokSrcHost(overrideHost);
      expect(result).toBe(overrideHost);
    });

    it("should use environment variable when override is invalid", () => {
      const envHost = "env.example.com";
      const invalidOverride = "invalid override";
      process.env.STORYBLOK_IMAGE_LOADER_HOST = envHost;

      const result = getStoryblokSrcHost(invalidOverride);
      expect(result).toBe(envHost);
    });
  });

  describe("hostname validation", () => {
    it("should accept single-level domains", () => {
      const result = getStoryblokSrcHost("localhost");
      expect(result).toBe("localhost");
    });

    it("should accept multi-level domains", () => {
      const host = "api.cdn.example.com";
      const result = getStoryblokSrcHost(host);
      expect(result).toBe(host);
    });

    it("should accept domains with numbers", () => {
      const host = "api2.example.com";
      const result = getStoryblokSrcHost(host);
      expect(result).toBe(host);
    });

    it("should accept IP addresses", () => {
      const host = "192.168.1.1";
      const result = getStoryblokSrcHost(host);
      expect(result).toBe(host);
    });

    it("should accept IP addresses with port", () => {
      const host = "192.168.1.1:8080";
      const result = getStoryblokSrcHost(host);
      expect(result).toBe(host);
    });

    it("should accept hosts starting with numbers (as current regex allows)", () => {
      const host = "123abc.com";
      const result = getStoryblokSrcHost(host);
      expect(result).toBe(host);
    });

    it("should accept high port numbers (as current regex allows)", () => {
      const host = "example.com:99999";
      const result = getStoryblokSrcHost(host);
      expect(result).toBe(host);
    });

    it("should reject hosts with multiple colons", () => {
      const invalidHost = "example.com:8080:extra";
      const result = getStoryblokSrcHost(invalidHost);
      expect(result).toBe(DEFAULT_HOST);
    });
  });
});
