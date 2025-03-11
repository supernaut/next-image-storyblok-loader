import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src/lib/storyblok-image-loader.ts",
    "./src/lib/get-storyblok-image-loader.ts",
    "./src/lib/img-src-is-storyblok.ts",
    "./src/types/storyblok-image-loader-options.ts",
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  platform: "neutral",
  format: ["esm"],
});
