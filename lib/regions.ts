import type { RegionSlug } from "@/lib/types";

export interface Region {
  slug: RegionSlug;
  label: string;
  shortLabel: string;
  intro: string;
  description: string;
}

export const regions: Region[] = [
  {
    slug: "azie",
    label: "Azië",
    shortLabel: "Azië",
    intro: "Van de rijstvelden van Bali tot de treinen van Japan.",
    description:
      "Routegidsen en tips voor Azië: landen waar we zelf rondtrokken en plekken die we graag nog eens zouden bezoeken. Met vervoer, budget en timing per bestemming.",
  },
  {
    slug: "midden-amerika",
    label: "Midden-Amerika",
    shortLabel: "Midden-Amerika",
    intro: "Watervallen, vulkanen en busritten door zeven landen.",
    description:
      "Midden-Amerika is compact maar veelzijdig: van de stranden van Costa Rica tot de ruïnes van Guatemala. Routegidsen met vervoer, kosten en de beste reisperiode.",
  },
  {
    slug: "zuid-amerika",
    label: "Zuid-Amerika",
    shortLabel: "Zuid-Amerika",
    intro: "Grote landen, lange afstanden en bergen die je adem afnemen.",
    description:
      "Zuid-Amerika vraagt om keuzes: welke landen, welke route, hoeveel tijd. Praktische gidsen en tips voor wie niet alles in één reis wil proppen.",
  },
  {
    slug: "europa",
    label: "Europa",
    shortLabel: "Europa",
    intro: "Dichtbij, betaalbaar en verrassend veelzijdig.",
    description:
      "Europa is ideaal voor kortere reizen: met de trein, de auto of gewoon een week. Tips over vervoer, seizoenen en steden die de drukte waard zijn.",
  },
  {
    slug: "afrika",
    label: "Afrika",
    shortLabel: "Afrika",
    intro: "Van de Kaap tot de Nijl: veel groter dan één reis.",
    description:
      "Afrika vraagt om planning: visa, afstanden, seizoenen en veiligheid. Routegidsen en tips die je helpen realistisch te plannen zonder de magie eruit te halen.",
  },
  {
    slug: "midden-oosten",
    label: "Midden-Oosten",
    shortLabel: "Midden-Oosten",
    intro: "Woestijnen, oude steden en gastvrijheid die je bijblijft.",
    description:
      "Het Midden-Oosten is warmer, droger en gastvrijer dan veel mensen denken. Praktische gidsen over routes, kleding, vervoer en de beste maanden.",
  },
  {
    slug: "oceanie",
    label: "Oceanië",
    shortLabel: "Oceanië",
    intro: "Eilanden, kustwegen en afstanden die je moet plannen.",
    description:
      "Oceanië is duur en groot, maar met de juiste route verrassend doenbaar. Tips over eilandhoppen, camperen en de beste periode per regio.",
  },
];

export function getRegion(slug: string): Region | undefined {
  return regions.find((region) => region.slug === slug);
}
