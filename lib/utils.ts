export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function routeHref(slug: string) {
  return `/reizen/${slug}`;
}

export function blogHref(slug: string) {
  return `/blog/${slug}`;
}
