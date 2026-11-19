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

export type RegionSlug =
  | "azie"
  | "midden-amerika"
  | "zuid-amerika"
  | "europa"
  | "afrika"
  | "midden-oosten"
  | "oceanie";

export type PostKind = "reisroute" | "tips" | "verhaal";

export interface ImageCredit {
  name: string;
  url: string;
  /** Platform waar de foto vandaan komt, bijvoorbeeld "Pixabay". */
  source?: string;
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
  /** Regio waarin het verhaal valt. Ontbreekt bij de handgeschreven verhalen. */
  region?: RegionSlug;
  /** Soort artikel: routegids, tipsartikel of persoonlijk verhaal. */
  kind?: PostKind;
  /** Wie het schreef: Mila zelf of de automatische redactie. */
  author?: "Mila" | "Redactie";
  /** Verplichte bronvermelding bij foto's van Pexels. */
  imageCredit?: ImageCredit;
  /** True bij artikelen die de generator heeft geschreven. */
  generated?: boolean;
  /** Interne sleutel om dubbele onderwerpen te voorkomen. */
  topicKey?: string;
}
