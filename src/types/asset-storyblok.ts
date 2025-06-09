import { StoryblokImageFocus } from "./storyblok-image-focus";

export type AssetStoryblok = {
  alt?: string;
  copyright?: string;
  filename: string;
  focus?: StoryblokImageFocus;
  id: number;
  name: string;
  title?: string;
};
