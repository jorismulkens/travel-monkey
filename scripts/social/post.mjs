#!/usr/bin/env node
/**
 * Plaatst automatisch een TikTok-fotocarrousel bij de nieuwste reisroutes.
 *
 * Gebruikt upload-post.com (POST /api/upload_photos) met de slides uit
 * scripts/social/render.mjs.
 *
 * Omgeving:
 *   UPLOAD_POST_API_KEY   verplicht (tenzij --dry-run)
 *   UPLOAD_POST_PROFILE   profielnaam uit het upload-post dashboard
 *   SOCIAL_POSTS_PER_DAY  standaard 2
 *   SITE_URL              standaard https://travel-monkey.vercel.app
 *
 * Gebruik:
 *   node scripts/social/post.mjs --dry-run
 *   node scripts/social/post.mjs --route <slug>
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSlides, caption } from "./render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run") || process.env.DRY_RUN === "true";
const requestedSlug =
  (process.argv.includes("--route")
    ? process.argv[process.argv.indexOf("--route") + 1]
    : undefined) ?? process.env.SOCIAL_ROUTE_SLUG ?? undefined;

const CONFIG = {
  apiKey: process.env.UPLOAD_POST_API_KEY ?? "",
  profile: process.env.UPLOAD_POST_PROFILE ?? "",
  perDay: Number(process.env.SOCIAL_POSTS_PER_DAY ?? 2),
  siteUrl: (process.env.SITE_URL ?? "https://travel-monkey.vercel.app").replace(
    /\/$/,
    "",
  ),
};

const POSTED_FILE = path.join(ROOT, "data", "social-posted.json");
const API_URL = "https://api.upload-post.com/api/upload_photos";

function log(...parts) {
  console.log(`[social] ${parts.join(" ")}`);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readRoutes() {
  const dir = path.join(ROOT, "data", "routes");

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")))
    .filter((route) => route.generated === true)
    .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
}

function pickRoutes() {
  const posted = readJson(POSTED_FILE, {});
  const routes = readRoutes();

  if (requestedSlug) {
    const route = routes.find((item) => item.slug === requestedSlug);

    if (!route) throw new Error(`Route niet gevonden: ${requestedSlug}`);

    return [route];
  }

  return routes
    .filter((route) => !posted[route.slug])
    .slice(0, Math.max(1, CONFIG.perDay));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForLive(route) {
  const url = `${CONFIG.siteUrl}/reizen/${route.slug}`;

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        log(`route staat live: ${url}`);
        return true;
      }
    } catch {
      // nog niet bereikbaar
    }

    await sleep(20000);
  }

  log(`route is niet live geworden: ${url}`);
  return false;
}

async function upload(route, files) {
  const text = caption(route, CONFIG.siteUrl);

  const form = new FormData();
  form.append("user", CONFIG.profile);
  form.append("platform[]", "tiktok");
  form.append("title", text);
  form.append("tiktok_description", text);
  form.append("privacy_level", "PUBLIC_TO_EVERYONE");
  form.append("post_mode", "DIRECT_POST");
  form.append("auto_add_music", "true");
  form.append("photo_cover_index", "0");

  for (const [index, file] of files.entries()) {
    const buffer = fs.readFileSync(file);
    form.append(
      "photos[]",
      new Blob([buffer], { type: "image/png" }),
      `slide-${index + 1}.png`,
    );
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Apikey ${CONFIG.apiKey}` },
    body: form,
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`upload-post ${response.status}: ${body.slice(0, 500)}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    return { raw: body };
  }
}

async function main() {
  const routes = pickRoutes();

  if (routes.length === 0) {
    log("geen nieuwe onbeplakte routes");
    return;
  }

  if (!DRY_RUN && (!CONFIG.apiKey || !CONFIG.profile)) {
    throw new Error(
      "UPLOAD_POST_API_KEY of UPLOAD_POST_PROFILE ontbreekt",
    );
  }

  const posted = readJson(POSTED_FILE, {});

  for (const route of routes) {
    log(`voorbereiden: ${route.slug}`);

    if (!DRY_RUN && !(await waitForLive(route))) {
      throw new Error(`route ${route.slug} is niet live; niet gepost`);
    }

    const outDir = path.join(ROOT, "social", route.slug);
    const files = await buildSlides(route, outDir);

    log(`${files.length} slides gebouwd voor ${route.slug}`);

    if (DRY_RUN) {
      log(`dry-run caption:\n${caption(route, CONFIG.siteUrl)}\n`);
      continue;
    }

    const result = await upload(route, files);
    log(`gepost: ${route.slug} — ${JSON.stringify(result).slice(0, 300)}`);

    posted[route.slug] = {
      date: new Date().toISOString(),
      request: result.request_id ?? result.requestId ?? null,
    };

    fs.writeFileSync(
      POSTED_FILE,
      `${JSON.stringify(posted, null, 2)}\n`,
      "utf8",
    );
  }

  log(`klaar: ${routes.length} route(s) verwerkt`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
