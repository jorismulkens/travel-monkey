const fallbackUrl = "https://travel-monkey.vercel.app";

function normalizeUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

/**
 * Vercel exposes the production domain automatically. The fallback keeps
 * local builds and previews predictable without requiring any manual setup.
 */
export const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    fallbackUrl,
);
