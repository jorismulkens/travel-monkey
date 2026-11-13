export type Coordinates = [number, number];

export type LocationType = "route" | "blog";

export interface LocationPin {
  id: string;
  name: string;
  country: string;
  coords: Coordinates;
  slug: string;
  type: LocationType;
  thumbnail: string;
  excerpt: string;
}

export interface Activity {
  title: string;
  description: string;
  price: string;
}

export interface RouteStop {
  id: string;
  number: number;
  name: string;
  area: string;
  coords: Coordinates;
  dayLabel: string;
  nights: number;
  image: string;
  imageAlt: string;
  description: string;
  activities: Activity[];
  tip: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface PracticalItem {
  label: string;
  value: string;
}

export interface Route {
  slug: string;
  title: string;
  kicker: string;
  country: string;
  region: string;
  durationDays: number;
  durationLabel: string;
  travelStyle: string;
  budget: string;
  budgetNote: string;
  bestTime: string;
  startPoint: string;
  endPoint: string;
  coverImage: string;
  coverAlt: string;
  excerpt: string;
  intro: string[];
  highlights: string[];
  stops: RouteStop[];
  gallery: GalleryImage[];
  practical: PracticalItem[];
  packing: string[];
  closingNote: string;
}

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  quote?: string;
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
}

export interface BlogLocation {
  name: string;
  country: string;
  coords: Coordinates;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  displayDate: string;
  readingTime: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  location: BlogLocation;
  intro: string[];
  sections: BlogSection[];
  tip: string;
  relatedLocationIds: string[];
  relatedRouteSlug: string;
}
