import "server-only";

import fs from "node:fs";
import path from "node:path";

import type { BlogPost, LocationPin, Route } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(dataDirectory, relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Contentbestand niet gevonden: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getAllRoutes(): Route[] {
  const routesDirectory = path.join(dataDirectory, "routes");

  return fs
    .readdirSync(routesDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<Route>(path.join("routes", file)))
    .sort((a, b) => a.durationDays - b.durationDays);
}

export function getRoute(slug: string): Route | undefined {
  try {
    return readJsonFile<Route>(path.join("routes", `${slug}.json`));
  } catch {
    return undefined;
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const blogDirectory = path.join(dataDirectory, "blog");

  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<BlogPost>(path.join("blog", file)))
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  try {
    return readJsonFile<BlogPost>(path.join("blog", `${slug}.json`));
  } catch {
    return undefined;
  }
}

export function getLocations(): LocationPin[] {
  return readJsonFile<LocationPin[]>("locations.json");
}

export function getRelatedLocations(ids: string[]): LocationPin[] {
  const locations = getLocations();

  return ids
    .map((id) => locations.find((location) => location.id === id))
    .filter((location): location is LocationPin => Boolean(location));
}

export function getRouteOptions(): { value: string; label: string }[] {
  const routes = getAllRoutes();

  return [
    { value: "alles", label: "Alle routes" },
    ...(routes.some((route) => route.durationDays <= 7)
      ? [{ value: "kort", label: "1–7 dagen" }]
      : []),
    ...(routes.some(
      (route) => route.durationDays >= 8 && route.durationDays <= 14,
    )
      ? [{ value: "middel", label: "8–14 dagen" }]
      : []),
    ...(routes.some((route) => route.durationDays >= 15)
      ? [{ value: "lang", label: "15+ dagen" }]
      : []),
  ];
}
