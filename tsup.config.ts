import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    "get-storyblok-image-loader": "./src/lib/get-storyblok-image-loader.ts",
    "img-src-is-storyblok": "./src/lib/img-src-is-storyblok.ts",
    index: "./src/index.ts",
    "storyblok-image-loader-options":
      "./src/types/storyblok-image-loader-options.ts",
  },
  format: ["esm", "cjs"],
  minify: false,
  platform: "neutral",
  sourcemap: true,
  splitting: false,
  target: "es2020",
  treeshake: true,
});
