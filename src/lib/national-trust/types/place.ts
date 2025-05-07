import type { NTLink } from "./link";

export interface NTPlace {
  id: {
    value: string;
  };
  type: "PLACE";
  title: string;
  description: string;
  town: string;
  county: string;
  links: Array<{ imageLink: NTLink } | { link: NTLink }>;
  location: {
    lat: number;
    lon: number;
  };
  tagRefs: string[];
  websiteUrlPath: string;
  dayOpeningStatus?: Array<{
    date: string;
    openingTimeStatus: string;
  }>;
  publicationChannels: string[];
  cmsRegion: string;
  websiteUrl: string;
  imageUrl: string;
  imageDescription: string;
  subTitle: string;
}
