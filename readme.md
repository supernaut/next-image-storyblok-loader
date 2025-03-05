[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

# Next Image Storyblok Loader

An image loader for the [Next.js Image component](https://nextjs.org/docs/pages/api-reference/components/image) to load images from [Storyblok](https://www.storyblok.com/).

Inspired by [@delicious-simplicity/next-image-imgix-loader](https://github.com/delicious-simplicity/next-image-imgix-loader/).

## Usage

Pass the loader to a Next.js Image component to load images from Storyblok directly instead of intermediate storage, resizing, etc on the Next.js server.

Install the package using your package manager of choice:

```sh
pnpm add @supernaut/next-image-storyblok-loader
```

```sh
npm install @supernaut/next-image-storyblok-loader
```

```sh
yarn add @supernaut/next-image-storyblok-loader
```

### Basic Usage

Import the loader as is to use default settings.

```tsx
import Image from "next/image";
import { storyblokImageLoader } from "@supernaut/next-image-storyblok-loader";

const Component = ({ image }) => {
  return (
    <Image
      loader={storyblokImageLoader}
      src={image.url}
      alt={image.title}
      width={image.width}
      height={image.height}
    />
  );
};
```

### Create an Image Loader with Options

You can import the `getStoryblokImageLoader` function to construct a loader with options.

```tsx
import Image from "next/image";
import { getStoryblokImageLoader } from "@supernaut/next-image-storyblok-loader";

const loader = getStoryblokImageLoader({ host: "my-custom-domain.com" });

const Component = ({ image }) => {
  return (
    <Image
      loader={loader}
      src={image.url}
      alt={image.title}
      width={image.width}
      height={image.height}
    />
  );
};
```

### Create Image URL's for getImageProps

You use the `getStoryblokImageSrc` function to create image src URL's to use with `getImageProps`.

This can be useful for creating picture elements with editorial responsive behaviors. Here is a simplified example of a component taking a single source image from Storyblok and creating a picture element showing differently cropped images depending on the screen orientation.

```tsx
iimport { getImageProps } from "next/image";
import {
  getStoryblokImageSrc,
  storyblokImageLoader,
} from "@supernaut/next-image-storyblok-loader";

const Component = ({ image }) => {
  const srcPortrait = getStoryblokImageSrc(image, {
    resize: {
      height: 800,
      width: 600,
    },
  });
  const srcLandscape = getStoryblokImageSrc(image, {
    resize: {
      height: 600,
      width: 800,
    },
  });
  const { props: propsPortrait } = getImageProps({
    ...image,
    src: srcPortrait,
    loader: storyblokImageLoader,
  });
  const { props: propsLandscape } = getImageProps({
    ...image,
    src: srcLandscape,
    loader: storyblokImageLoader,
  });

  return (
    <picture>
      <source media="(orientation: portrait)" {...propsPortrait} />
      <source media="(orientation: landscape)" {...propsLandscape} />
      <img {...propsLandscape} />
    </picture>
  );
};

```

## Options

### Setting Options

You can either provide options to the `getStoryblokImageLoader` function or set them with environment variables. Using environment variables is generally simpler, but if you need to set optios conditionally at runtime there might be scenarios where using options and the factory function works better.

### Host

The default host is set to `a.storyblok.com` and can be overriden with either the `STORYBLOK_IMAGE_LOADER_HOST` environment variable or the `host` option.

This is intentionally `host` and not `hostname` and allows for setting an optional port if needed.

This is useful if you rewrite image requests to another hostname, or using Storyblok in a region outside the EU that might have a different subdomain.

Setting the `host` option to `my-domain.com` would change the generated `src` URL from `https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/2600x0/` to `https://my-domain.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/2600x0/`.

### Prefix

An optional overriding prefix can be set using the `STORYBLOK_IMAGE_LOADER_PREFIX` environment variable or the `prefix` option.

This is useful if you rewrite image requests to a pathname instead of a complete URL.

Setting the `prefix` option to `/assets/storyblok` would change the generated `src` URL from `https://a.storyblok.com/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/2600x0/` to `/assets/storyblok/f/88751/2600x1214/2c6ef16b8f/hero-visual-editor.png/m/2600x0/`.
