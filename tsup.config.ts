import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    "get-storyblok-image-loader": "./src/lib/get-storyblok-image-loader.ts",
    "img-src-is-storyblok": "./src/lib/img-src-is-storyblok.ts",
    "storyblok-image-loader-options":
      "./src/types/storyblok-image-loader-options.ts",
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  platform: "neutral",
  format: ["esm", "cjs"],
  target: "es2020",
  minify: false,
  treeshake: true,
});
