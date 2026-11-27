#!/usr/bin/env node
/**
 * Bouwt de slides voor een TikTok-fotocarrousel bij een reisroute.
 *
 * Slide 1: kaart met genummerde stops (zoals het voorbeeld)
 * Slide 2..n: een foto per stop met daglabel, titel en prijs
 * Laatste slide: de hele route + link
 *
 * Gebruik:
 *   node scripts/social/render.mjs --route <slug> --out social/<slug>
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

export const COLORS = {
  sand: "#FBF6EC",
  jungle: "#1B2A23",
  sunset: "#E58A5B",
  deep: "#C2592F",
};

const W = 1080;
const H = 1920;

/* ----------------------------- hulpfuncties ----------------------------- */

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);

  return lines;
}

function lonToX(lon, z) {
  return ((lon + 180) / 360) * 256 * 2 ** z;
}

function latToY(lat, z) {
  const sin = Math.sin((lat * Math.PI) / 180);
  return (
    (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * 256 * 2 ** z
  );
}

function svgBase(body) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`,
  );
}

/* -------------------------------- kaart -------------------------------- */

const TILE_URL = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

async function fetchTile(z, x, y) {
  try {
    const response = await fetch(TILE_URL(z, x, y), {
      headers: {
        "User-Agent": "TravelMonkeyBot/1.0 (https://travel-monkey.vercel.app)",
      },
    });

    if (!response.ok) return undefined;

    return Buffer.from(await response.arrayBuffer());
  } catch {
    return undefined;
  }
}

function pickZoom(stops, maxW, maxH) {
  const lats = stops.map((stop) => stop.coords[0]);
  const lons = stops.map((stop) => stop.coords[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  for (let z = 10; z >= 3; z -= 1) {
    const x1 = lonToX(minLon, z);
    const x2 = lonToX(maxLon, z);
    const y1 = latToY(maxLat, z);
    const y2 = latToY(minLat, z);

    if (x2 - x1 <= maxW && y2 - y1 <= maxH) return z;
  }

  return 3;
}

function spreadMarkers(markers, width, height, minDistance = 80, iterations = 140) {
  const points = markers.map((marker) => ({ ...marker }));

  for (let round = 0; round < iterations; round += 1) {
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.max(0.01, Math.hypot(dx, dy));

        if (distance < minDistance) {
          const push = (minDistance - distance) / 2;
          const ux = dx / distance;
          const uy = dy / distance;

          a.x -= ux * push;
          a.y -= uy * push;
          b.x += ux * push;
          b.y += uy * push;
        }
      }
    }
  }

  for (const point of points) {
    point.x = Math.round(Math.min(width - 60, Math.max(60, point.x)));
    point.y = Math.round(Math.min(height - 60, Math.max(60, point.y)));
  }

  return points;
}

async function buildMapCard(stops, cardW, cardH) {
  const z = pickZoom(stops, cardW - 180, cardH - 180);
  const xs = stops.map((stop) => lonToX(stop.coords[1], z));
  const ys = stops.map((stop) => latToY(stop.coords[0], z));

  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

  const originX = cx - cardW / 2;
  const originY = cy - cardH / 2;

  const startX = Math.floor(originX / 256);
  const endX = Math.floor((originX + cardW) / 256);
  const startY = Math.floor(originY / 256);
  const endY = Math.floor((originY + cardH) / 256);

  const jobs = [];

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      jobs.push({ x, y });
    }
  }

  const tiles = [];
  const concurrency = 6;

  for (let i = 0; i < jobs.length; i += concurrency) {
    const batch = jobs.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (job) => ({
        ...job,
        buffer: await fetchTile(z, job.x, job.y),
      })),
    );
    tiles.push(...results);
  }

  const composite = tiles
    .filter((tile) => tile.buffer)
    .map((tile) => ({
      input: tile.buffer,
      left: Math.round(tile.x * 256 - originX),
      top: Math.round(tile.y * 256 - originY),
    }));

  const base = await sharp({
    create: {
      width: cardW,
      height: cardH,
      channels: 3,
      background: "#e8e3d6",
    },
  })
    .composite(composite)
    .png()
    .toBuffer();

  const markers = spreadMarkers(
    stops.map((stop, index) => ({
      x: Math.round(lonToX(stop.coords[1], z) - originX),
      y: Math.round(latToY(stop.coords[0], z) - originY),
      index,
      stop,
    })),
    cardW,
    cardH,
  );

  const line = markers.map((m) => `${m.x},${m.y}`).join(" ");

  const dots = markers
    .map(
      (m) => `
      <circle cx="${m.x}" cy="${m.y}" r="26" fill="${COLORS.sunset}" stroke="${COLORS.sand}" stroke-width="5"/>
      <text x="${m.x}" y="${m.y + 10}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="bold" fill="${COLORS.jungle}">${m.index + 1}</text>
    `,
    )
    .join("");

  const overlay = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${cardW}" height="${cardH}">
      <rect x="0" y="0" width="${cardW}" height="${cardH}" fill="${COLORS.sand}" opacity="0.12"/>
      <polyline points="${line}" fill="none" stroke="${COLORS.jungle}" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round" opacity="0.85"/>
      ${dots}
      <rect x="${cardW - 190}" y="${cardH - 46}" width="170" height="34" rx="8" fill="${COLORS.sand}" opacity="0.9"/>
      <text x="${cardW - 105}" y="${cardH - 22}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="${COLORS.jungle}">© OpenStreetMap</text>
    </svg>
  `);

  return sharp(base)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

function roundedMask(width, height, radius) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );
}

/* ------------------------------ tekstlagen ------------------------------ */

function mapSlideOverlay(route) {
  const lines = wrap(route.introHeading ?? route.travelStyle, 30).slice(0, 2);

  return svgBase(`
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1B2A23"/>
        <stop offset="1" stop-color="#0E1712"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="${W - 40}" cy="170" r="190" fill="none" stroke="${COLORS.sand}" stroke-opacity="0.08" stroke-width="2"/>
    <circle cx="30" cy="${H - 260}" r="150" fill="none" stroke="${COLORS.sand}" stroke-opacity="0.08" stroke-width="2"/>

    <text x="64" y="150" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" letter-spacing="8" fill="${COLORS.sunset}">REISROUTE</text>
    <text x="64" y="255" font-family="Georgia, 'DejaVu Serif', serif" font-size="78" font-weight="bold" fill="${COLORS.sand}">${escapeXml(
      route.durationLabel,
    )}</text>
    <text x="64" y="365" font-family="Georgia, 'DejaVu Serif', serif" font-size="94" font-weight="bold" fill="${COLORS.sand}">${escapeXml(
      route.country,
    )}</text>
    ${lines
      .map(
        (line, index) =>
          `<text x="64" y="${455 + index * 48}" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${COLORS.sand}" opacity="0.85">${escapeXml(line)}</text>`,
      )
      .join("")}

    <text x="64" y="${H - 150}" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="bold" fill="${COLORS.sand}">${route.stops.length} stops · travel-monkey.vercel.app</text>
  `);
}

function trimText(text, maxChars) {
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxChars).trim()}…`;
}

function stopOverlay(route, stop, index) {
  const wrapped = wrap(trimText(stop.description, 150), 42);
  const body = wrapped.slice(0, 3);
  const price = stop.activities?.[0]?.price;
  const priceText = price ? trimText(price, 34) : undefined;
  const priceWidth = priceText
    ? Math.min(940, Math.max(300, priceText.length * 22 + 60))
    : 0;

  if (wrapped.length > 3) {
    body[2] = `${body[2].replace(/[.,;:]$/, "")}…`;
  }

  return svgBase(`
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${COLORS.jungle}" stop-opacity="0"/>
        <stop offset="0.35" stop-color="${COLORS.jungle}" stop-opacity="0.5"/>
        <stop offset="0.7" stop-color="${COLORS.jungle}" stop-opacity="0.88"/>
        <stop offset="1" stop-color="${COLORS.jungle}" stop-opacity="0.97"/>
      </linearGradient>
    </defs>
    <rect x="0" y="${H - 1300}" width="${W}" height="1300" fill="url(#fade)"/>
    <rect x="40" y="${H - 770}" width="1000" height="540" rx="36" fill="${COLORS.jungle}" opacity="0.3"/>
    <text x="64" y="${H - 720}" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" letter-spacing="6" fill="${COLORS.sunset}">STOP ${index + 1} / ${route.stops.length} · ${escapeXml(
      stop.dayLabel.toUpperCase(),
    )}</text>
    <text x="64" y="${H - 630}" font-family="Georgia, 'DejaVu Serif', serif" font-size="86" font-weight="bold" fill="${COLORS.sand}">${escapeXml(
      stop.name,
    )}</text>
    ${body
      .map(
        (line, i) =>
          `<text x="64" y="${H - 545 + i * 50}" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="${COLORS.sand}" opacity="0.9">${escapeXml(line)}</text>`,
      )
      .join("")}
    ${
      priceText
        ? `<rect x="64" y="${H - 330}" width="${priceWidth}" height="66" rx="33" fill="${COLORS.sunset}"/>
           <text x="${64 + priceWidth / 2}" y="${H - 285}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="${COLORS.jungle}">${escapeXml(
             priceText,
           )}</text>`
        : ""
    }
    <text x="64" y="${H - 70}" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="${COLORS.sand}" opacity="0.75">travel-monkey.vercel.app</text>
  `);
}

function ctaOverlay(route) {
  const lines = wrap(route.title, 24).slice(0, 3);

  return svgBase(`
    <rect x="0" y="0" width="${W}" height="${H}" fill="${COLORS.jungle}" opacity="0.82"/>
    <text x="540" y="560" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" letter-spacing="8" fill="${COLORS.sunset}">DE HELE ROUTE</text>
    ${lines
      .map(
        (line, index) =>
          `<text x="540" y="${680 + index * 96}" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-size="84" font-weight="bold" fill="${COLORS.sand}">${escapeXml(line)}</text>`,
      )
      .join("")}
    <text x="540" y="${1010}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="${COLORS.sand}" opacity="0.85">${route.stops.length} stops · ${route.durationDays} dagen · ${escapeXml(
      route.budget,
    )}</text>
    <rect x="140" y="1180" width="800" height="120" rx="60" fill="${COLORS.sunset}"/>
    <text x="540" y="1256" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="bold" fill="${COLORS.jungle}">travel-monkey.vercel.app</text>
    <text x="540" y="1420" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${COLORS.sand}" opacity="0.8">Met prijzen, paklijst en alle stops</text>
  `);
}

/* -------------------------------- bouwen -------------------------------- */

function imageFile(route, stopImage) {
  const clean = stopImage.replace(/^\//, "");
  return path.join(ROOT, "public", clean);
}

async function cover(route) {
  return sharp(imageFile(route, route.coverImage))
    .resize(W, H, { fit: "cover", position: "attention" })
    .toBuffer();
}

export async function buildSlides(route, outDir) {
  fs.mkdirSync(outDir, { recursive: true });

  const files = [];
  const coverImage = await cover(route);

  // 1. kaart
  const cardW = 940;
  const cardH = 860;
  const rawCard = await buildMapCard(route.stops, cardW, cardH);
  const card = await sharp(rawCard)
    .composite([{ input: roundedMask(cardW, cardH, 36), blend: "dest-in" }])
    .png()
    .toBuffer();

  const slide1 = await sharp(await sharp(mapSlideOverlay(route)).png().toBuffer())
    .composite([{ input: card, left: 70, top: 640 }])
    .png()
    .toBuffer();
  const file1 = path.join(outDir, "slide-1.png");
  fs.writeFileSync(file1, slide1);
  files.push(file1);

  // 2. per stop
  for (const [index, stop] of route.stops.entries()) {
    let photo;

    try {
      photo = await sharp(imageFile(route, stop.image))
        .resize(W, H, { fit: "cover", position: "attention" })
        .toBuffer();
    } catch {
      photo = coverImage;
    }

    const slide = await sharp(photo)
      .composite([{ input: stopOverlay(route, stop, index), top: 0, left: 0 }])
      .png()
      .toBuffer();

    const file = path.join(outDir, `slide-${index + 2}.png`);
    fs.writeFileSync(file, slide);
    files.push(file);
  }

  // laatste slide
  const blurred = await sharp(coverImage).blur(24).modulate({ brightness: 0.7 }).toBuffer();
  const last = await sharp(blurred)
    .composite([{ input: ctaOverlay(route), top: 0, left: 0 }])
    .png()
    .toBuffer();

  const lastFile = path.join(outDir, `slide-${files.length + 1}.png`);
  fs.writeFileSync(lastFile, last);
  files.push(lastFile);

  return files;
}

function shorten(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
}

function budgetLine(route) {
  const candidates = [route.budget, route.budgetNote].filter(Boolean);

  for (const text of candidates) {
    const sentences = String(text).split(/(?<=[.!?])\s+/);
    const hit = sentences.find((sentence) => /[€$]|\d/.test(sentence));

    if (hit) return shorten(hit, 120);
  }

  return "";
}

export function caption(route, siteUrl) {
  const stops = shorten(route.stops.map((stop) => stop.name).join(" → "), 150);
  const budget = budgetLine(route);
  const tag = route.country
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  return [
    `${route.durationLabel} ${route.country}: ${route.title.split(":")[1]?.trim() ?? route.title}`,
    "",
    `Stops: ${stops}`,
    ...(budget ? [`Budget: ${budget}`] : []),
    `Beste reistijd: ${route.bestTime}`,
    "",
    `De hele route met prijzen en tips: ${siteUrl}/reizen/${route.slug}`,
    "",
    `#reizen #reistips #${tag} #rondreis #backpacken`,
  ].join("\n");
}

/* -------------------------------- CLI ---------------------------------- */

const isDirectRun =
  process.argv[1] &&
  new URL(import.meta.url).pathname === path.resolve(process.argv[1]);

if (isDirectRun) {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf("--route");
  const slug = slugIndex >= 0 ? args[slugIndex + 1] : undefined;

  if (!slug) {
    console.error("Gebruik: node scripts/social/render.mjs --route <slug>");
    process.exit(1);
  }

  const route = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data", "routes", `${slug}.json`), "utf8"),
  );

  const out = path.join(ROOT, "social", slug);

  buildSlides(route, out)
    .then((files) => {
      console.log(`[social] ${files.length} slides in ${out}`);
      for (const file of files) console.log(" -", path.basename(file));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
