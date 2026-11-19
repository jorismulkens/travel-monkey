#!/usr/bin/env node
/**
 * Dagelijkse routegenerator voor Travel Monkey.
 *
 * Schrijft per run een aantal complete reisroutes in de stijl van de Bali-route:
 * met stops, activiteiten en prijzen, praktische info, paklijst en foto's.
 * De GitHub Action commit de routes, waarna Vercel opnieuw bouwt.
 *
 * Gebruik:
 *   node scripts/generate.mjs                 # echte run (5 routes)
 *   node scripts/generate.mjs --dry-run       # schrijven zonder op te slaan
 *   node scripts/generate.mjs --mock          # offline test met nepdata
 *
 * Omgevingsvariabelen:
 *   OPENAI_API_KEY   verplicht (behalve bij --mock)
 *   OPENAI_MODEL     standaard gpt-4.1-mini
 *   PIXABAY_API_KEY  fotosleutel (aanbevolen); zonder key een reservecover per regio
 *   PEXELS_API_KEY   optioneel alternatief voor Pixabay
 *   POSTS_PER_DAY    standaard 5
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const ROUTES_DIR = path.join(DATA_DIR, "routes");
const LOCATIONS_FILE = path.join(DATA_DIR, "locations.json");
const TOPICS_FILE = path.join(DATA_DIR, "topics.json");

const args = new Set(process.argv.slice(2));
const MOCK = args.has("--mock");
const DRY_RUN = args.has("--dry-run");

const CONFIG = {
  count: clamp(Number(process.env.POSTS_PER_DAY ?? 5), 1, 10),
  model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  openaiKey: process.env.OPENAI_API_KEY ?? "",
  pixabayKey: process.env.PIXABAY_API_KEY ?? "",
  pexelsKey: process.env.PEXELS_API_KEY ?? "",
  imagesDir: path.join(ROOT, "public", "images", "posts"),
  maxAttempts: 3,
};

const REGION_LABELS = {
  azie: "Azië",
  "midden-amerika": "Midden-Amerika",
  "zuid-amerika": "Zuid-Amerika",
  europa: "Europa",
  afrika: "Afrika",
  "midden-oosten": "Midden-Oosten",
  oceanie: "Oceanië",
};

const VARIANT_DAYS = {
  "1 week": 7,
  "2 weken": 14,
  "3 weken": 21,
};

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function log(...parts) {
  console.log(`[generator] ${parts.join(" ")}`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readRoutes() {
  return fs
    .readdirSync(ROUTES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson(path.join(ROUTES_DIR, file)));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function formatDate(date) {
  const iso = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Amsterdam",
  }).format(date);

  return { iso };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function wordsOf(value) {
  return String(value ?? "")
    .split(/\s+/)
    .filter(Boolean).length;
}

function countRouteWords(route) {
  const chunks = [
    route.title,
    route.excerpt,
    ...(route.intro ?? []),
    ...(route.highlights ?? []),
    ...(route.stops ?? []).flatMap((stop) => [
      stop.name,
      stop.description,
      stop.tip,
      ...(stop.activities ?? []).flatMap((activity) => [
        activity.title,
        activity.description,
      ]),
    ]),
    ...(route.practical ?? []).map((item) => item.value),
  ];

  return wordsOf(chunks.join(" "));
}

/* ------------------------------------------------------------------ */
/* Onderwerpkeuze                                                      */
/* ------------------------------------------------------------------ */

function selectTopics(routes, count) {
  const topics = readJson(TOPICS_FILE);
  const usedKeys = new Set(routes.map((route) => route.topicKey).filter(Boolean));
  const usage = new Map();

  for (const route of routes) {
    if (!route.topicKey) continue;
    const key = String(route.topicKey).split(":")[0];
    usage.set(key, (usage.get(key) ?? 0) + 1);
  }

  const candidates = [];

  for (const destination of topics.destinations) {
    for (const variant of destination.routeVariants) {
      const topicKey = `${destination.key}:reisroute:${slugify(variant)}`;
      if (usedKeys.has(topicKey)) continue;

      candidates.push({
        destination,
        variant,
        days: VARIANT_DAYS[variant] ?? 14,
        topicKey,
        usage: usage.get(destination.key) ?? 0,
      });
    }
  }

  candidates.sort((a, b) => {
    if (a.usage !== b.usage) return a.usage - b.usage;
    return Math.random() - 0.5;
  });

  const picked = [];
  const usedDestinations = new Set();
  const usedRegions = new Set();

  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (usedDestinations.has(candidate.destination.key)) continue;

    const freshRegion = !usedRegions.has(candidate.destination.region);

    if (!freshRegion && picked.length < count) {
      // Bewaar deze kandidaat voor als er geen verse regio's meer zijn.
      continue;
    }

    picked.push(candidate);
    usedDestinations.add(candidate.destination.key);
    usedRegions.add(candidate.destination.region);
  }

  // Vul aan als er minder regio's dan routes zijn.
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (usedDestinations.has(candidate.destination.key)) continue;
    picked.push(candidate);
    usedDestinations.add(candidate.destination.key);
  }

  return picked;
}

/* ------------------------------------------------------------------ */
/* Prompt en schema                                                    */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `Je bent reisredacteur bij Travel Monkey, een Nederlands reisblog.
Je schrijft complete reisroutes in het Nederlands, in de stijl van een persoonlijke reisgids.

Schrijfstijl:
- Je-vorm. Gebruik nooit "ik", "mijn", "wij" of "onze", en doe niet alsof je er zelf was.
- Nuchter, warm en concreet. Geen superlatieven zoals "paradijs", "parel" of "hidden gem".
- Korte alinea's van twee tot vier zinnen. Wissel tekst af met opsommingen.
- Geen verzonnen namen van hotels, restaurants of tours. Noem hooguit het type plek.
- Geen exacte prijzen als je ze niet zeker weet: gebruik bandbreedtes zoals "15-25 euro" en zeg dat prijzen kunnen afwijken.
- Geen openingstijden, visa-eisen of veiligheidsgaranties beweren.
- Geen verwijzingen naar AI of taalmodellen.
- Nederlands, correct gespeld, zonder onnodige Engelse woorden.

Inhoud:
- Elke route heeft 5 stops. Elke stop heeft een duidelijke plek, een dagindeling,
  een beschrijving van 120 tot 180 woorden, twee of drie activiteiten met een
  prijsindicatie en een praktische tip.
- De route is realistisch: de nachten tellen op tot ongeveer de reisduur.
- Sluit af met een korte slotnoot van 3 tot 5 zinnen.
- Lever alleen JSON op volgens het gevraagde schema.`;

function buildUserPrompt(topic, existingTitles) {
  const d = topic.destination;
  const regionLabel = REGION_LABELS[d.region];

  return `Schrijf een complete reisroute door ${d.name} (${d.country}), regio ${regionLabel}.
Duur: ${topic.variant} (${topic.days} dagen).
Plaatsen die in de route passen: ${d.places.join(", ")}.

Eisen:
- Titel: noem de duur en één onderscheidende hoek, zonder de landnaam twee keer.
- 5 stops, van start- tot eindpunt, met een logische reisvolgorde.
- Per stop: naam, gebied, daglabel (bijv. "Dag 1-3"), aantal nachten, beschrijving
  (120-180 woorden), 2-3 activiteiten met prijsindicatie, en een tip.
- Praktisch: 5 onderdelen (vervoer, verblijf, budget, beste reistijd, geld/internet)
  met concrete bandbreedtes.
- Paklijst: 7 tot 9 items.
- Highlights: 5 korte zinnen.
- De nachten tellen op tot ongeveer ${topic.days} dagen.

Bestaande titels (niet herhalen): ${existingTitles.slice(-30).join(" | ")}`;
}

const ROUTE_SCHEMA = {
  name: "travel_route",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "kicker",
      "country",
      "region",
      "durationLabel",
      "durationDays",
      "travelStyle",
      "budget",
      "budgetNote",
      "bestTime",
      "startPoint",
      "endPoint",
      "excerpt",
      "intro",
      "highlights",
      "stops",
      "practical",
      "packing",
      "closingNote",
      "coverImageQuery",
    ],
    properties: {
      title: { type: "string" },
      kicker: { type: "string" },
      country: { type: "string" },
      region: { type: "string" },
      durationLabel: { type: "string" },
      durationDays: { type: "integer" },
      travelStyle: { type: "string" },
      budget: { type: "string" },
      budgetNote: { type: "string" },
      bestTime: { type: "string" },
      startPoint: { type: "string" },
      endPoint: { type: "string" },
      excerpt: { type: "string" },
      intro: { type: "array", items: { type: "string" } },
      highlights: { type: "array", items: { type: "string" } },
      stops: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "name",
            "area",
            "dayLabel",
            "nights",
            "description",
            "tip",
            "imageAlt",
            "imageQuery",
            "activities",
          ],
          properties: {
            name: { type: "string" },
            area: { type: "string" },
            dayLabel: { type: "string" },
            nights: { type: "integer" },
            description: { type: "string" },
            tip: { type: "string" },
            imageAlt: { type: "string" },
            imageQuery: { type: "string" },
            activities: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["title", "description", "price"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  price: { type: "string" },
                },
              },
            },
          },
        },
      },
      practical: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "value"],
          properties: {
            label: { type: "string" },
            value: { type: "string" },
          },
        },
      },
      packing: { type: "array", items: { type: "string" } },
      closingNote: { type: "string" },
      coverImageQuery: { type: "string" },
    },
  },
};

/* ------------------------------------------------------------------ */
/* OpenAI                                                              */
/* ------------------------------------------------------------------ */

async function callOpenAI(messages) {
  const body = {
    model: CONFIG.model,
    temperature: 0.8,
    messages,
    response_format: { type: "json_schema", json_schema: ROUTE_SCHEMA },
  };

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONFIG.openaiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI ${response.status}: ${text.slice(0, 400)}`);
      }

      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content;

      if (!content) throw new Error("Leeg antwoord van OpenAI");

      return JSON.parse(content);
    } catch (error) {
      lastError = error;
      const retryable = /429|500|502|503|timeout|fetch failed/i.test(String(error));

      if (!retryable || attempt === 3) break;

      await sleep(2000 * attempt);
    }
  }

  throw lastError;
}

/* ------------------------------------------------------------------ */
/* Validatie                                                           */
/* ------------------------------------------------------------------ */

const FIRST_PERSON = /\b(ik|Ik|IK|mijn|Mijn|MIJN|wij|Wij|WIJ|onze|Onze|ONZE)\b/;
const BANNED = [
  "als ai",
  "language model",
  "hidden gem",
  "bucketlist",
  "paradijs",
  "lorem ipsum",
  "plaatsnaam",
  "{{",
];

function validateRoute(route, topic) {
  const errors = [];
  const text = [
    route.title,
    route.excerpt,
    ...route.intro,
    ...route.highlights,
    ...route.stops.flatMap((stop) => [
      stop.description,
      stop.tip,
      ...stop.activities.flatMap((activity) => [
        activity.title,
        activity.description,
      ]),
    ]),
    ...route.practical.map((item) => item.value),
    route.closingNote,
  ]
    .join(" ")
    .toLowerCase();

  const words = countRouteWords(route);

  if (!route.title || route.title.length < 25 || route.title.length > 110) {
    errors.push("titel moet 25-110 tekens zijn");
  }

  if (!route.excerpt || route.excerpt.length < 70 || route.excerpt.length > 320) {
    errors.push("samenvatting moet 70-320 tekens zijn");
  }

  if (!Array.isArray(route.intro) || route.intro.length < 2 || route.intro.length > 3) {
    errors.push("intro moet 2 of 3 alinea's hebben");
  }

  if (!Array.isArray(route.highlights) || route.highlights.length < 4) {
    errors.push("te weinig highlights");
  }

  if (!Array.isArray(route.stops) || route.stops.length < 5 || route.stops.length > 6) {
    errors.push(`route moet 5 of 6 stops hebben (nu ${route.stops?.length})`);
  }

  for (const stop of route.stops ?? []) {
    if (!stop.name || !stop.area || !stop.dayLabel) {
      errors.push(`stop ${stop.name ?? "?"} mist naam, gebied of daglabel`);
    }

    if (wordsOf(stop.description) < 60) {
      errors.push(`beschrijving van ${stop.name} is te kort`);
    }

    if (!Array.isArray(stop.activities) || stop.activities.length < 2) {
      errors.push(`${stop.name} heeft minimaal 2 activiteiten nodig`);
    }

    for (const activity of stop.activities ?? []) {
      if (!activity.title || !activity.price) {
        errors.push(`${stop.name}: activiteit mist titel of prijs`);
      }
    }

    if (!stop.tip || stop.tip.length < 40) {
      errors.push(`${stop.name} mist een tip`);
    }

    if (!stop.imageQuery || !stop.imageAlt) {
      errors.push(`${stop.name} mist een fotozoekopdracht`);
    }
  }

  if (!Array.isArray(route.practical) || route.practical.length < 4) {
    errors.push("te weinig praktische informatie");
  }

  if (!Array.isArray(route.packing) || route.packing.length < 6) {
    errors.push("paklijst is te kort");
  }

  if (!route.closingNote || route.closingNote.length < 100) {
    errors.push("slotnoot is te kort");
  }

  if (words < 700) {
    errors.push(`te weinig tekst (${words} woorden)`);
  }

  if (FIRST_PERSON.test(text)) {
    errors.push("gebruikt ik/wij/mijn/onze; schrijf in de je-vorm");
  }

  for (const phrase of BANNED) {
    if (text.includes(phrase)) errors.push(`bevat verboden frase: ${phrase}`);
  }

  const nights = (route.stops ?? []).reduce((sum, stop) => sum + (stop.nights ?? 0), 0);

  if (nights < topic.days - 6 || nights > topic.days) {
    errors.push(`aantal nachten (${nights}) past niet bij ${topic.days} dagen`);
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Foto's: zoeken, downloaden en verkleinen                            */
/* ------------------------------------------------------------------ */

export async function downloadImage(url, filename, { width = 1400, quality = 78 } = {}) {
  const response = await fetch(url, {
    headers: { "User-Agent": "TravelMonkeyBot/1.0" },
  });

  if (!response.ok) throw new Error(`download gaf ${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) throw new Error("reactie is geen afbeelding");

  const buffer = Buffer.from(await response.arrayBuffer());
  const { default: sharp } = await import("sharp");

  const webp = await sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  fs.mkdirSync(CONFIG.imagesDir, { recursive: true });
  fs.writeFileSync(path.join(CONFIG.imagesDir, `${filename}.webp`), webp);

  return `/images/posts/${filename}.webp`;
}

async function searchPixabay(query) {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", CONFIG.pixabayKey);
  url.searchParams.set("q", query.slice(0, 100));
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("orientation", "horizontal");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("per_page", "20");
  url.searchParams.set("min_width", "1200");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Pixabay gaf ${response.status}`);

  const payload = await response.json();

  return (payload.hits ?? [])
    .filter((hit) => hit.largeImageURL)
    .map((hit) => ({
      url: hit.largeImageURL,
      credit: { name: hit.user, url: hit.pageURL, source: "Pixabay" },
    }));
}

async function searchPexels(query) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
    { headers: { Authorization: CONFIG.pexelsKey } },
  );

  if (!response.ok) throw new Error(`Pexels gaf ${response.status}`);

  const payload = await response.json();

  return (payload.photos ?? [])
    .filter((photo) => photo.width >= 1200)
    .map((photo) => ({
      url: photo.src?.large2x ?? photo.src?.large ?? photo.src?.original,
      credit: {
        name: photo.photographer,
        url: photo.url,
        source: "Pexels",
      },
    }));
}

async function resolveImage(queries, filename, region, { width = 1400 } = {}) {
  const fallback = {
    url: `/images/regio/${region}.jpg`,
    alt: "",
    credit: undefined,
  };

  const provider = CONFIG.pixabayKey
    ? searchPixabay
    : CONFIG.pexelsKey
      ? searchPexels
      : undefined;

  if (!provider) return fallback;

  for (const query of queries.filter(Boolean).slice(0, 2)) {
    let candidates = [];

    try {
      candidates = await provider(String(query).trim());
    } catch (error) {
      log(`fotozoekopdracht mislukt: ${String(error).slice(0, 120)}`);
      continue;
    }

    for (const candidate of candidates.slice(0, 4)) {
      try {
        const url = await downloadImage(candidate.url, filename, { width });
        return { url, alt: "", credit: candidate.credit };
      } catch (error) {
        log(`foto overgeslagen: ${String(error).slice(0, 100)}`);
      }
    }
  }

  return fallback;
}

/* ------------------------------------------------------------------ */
/* Geocoding                                                           */
/* ------------------------------------------------------------------ */

async function geocode(place, country) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${place}, ${country}`)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "TravelMonkeyBot/1.0 (https://travel-monkey.vercel.app)",
        },
      },
    );

    if (!response.ok) return undefined;

    const results = await response.json();
    const first = results?.[0];

    return first ? [Number(first.lat), Number(first.lon)] : undefined;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Route bouwen                                                        */
/* ------------------------------------------------------------------ */

async function buildRoute({ article, topic, date, slug, images, stopCoords }) {
  const destination = topic.destination;

  return {
    slug,
    title: article.title.trim(),
    kicker: article.kicker?.trim() || "Zelf samengestelde route",
    country: article.country?.trim() || destination.country,
    region: article.region?.trim() || destination.name,
    durationDays: article.durationDays || topic.days,
    durationLabel: article.durationLabel || topic.variant,
    travelStyle: article.travelStyle?.trim() || "Rustig tempo",
    budget: article.budget?.trim(),
    budgetNote: article.budgetNote?.trim(),
    bestTime: article.bestTime?.trim(),
    startPoint: article.startPoint?.trim(),
    endPoint: article.endPoint?.trim(),
    coverImage: images.cover.url,
    coverAlt: article.excerpt?.trim() || `Reisroute door ${destination.name}`,
    excerpt: article.excerpt.trim(),
    intro: article.intro.map((p) => p.trim()),
    highlights: article.highlights.map((h) => h.trim()),
    stops: article.stops.map((stop, index) => ({
      id: `${slugify(stop.name)}-${index + 1}`,
      number: index + 1,
      name: stop.name.trim(),
      area: stop.area.trim(),
      coords: stopCoords[index] ?? [0, 0],
      dayLabel: stop.dayLabel.trim(),
      nights: Number(stop.nights) || 1,
      image: images.stops[index]?.url ?? images.cover.url,
      imageAlt: stop.imageAlt?.trim() || stop.name,
      description: stop.description.trim(),
      activities: stop.activities.map((activity) => ({
        title: activity.title.trim(),
        description: activity.description.trim(),
        price: activity.price.trim(),
      })),
      tip: stop.tip.trim(),
    })),
    gallery: article.stops.slice(0, 5).map((stop, index) => ({
      src: images.stops[index]?.url ?? images.cover.url,
      alt: stop.imageAlt?.trim() || stop.name,
      caption: `${stop.name} — ${stop.area}`,
    })),
    practical: article.practical.map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    })),
    packing: article.packing.map((item) => item.trim()),
    closingNote: article.closingNote.trim(),
    continent: destination.region,
    author: "Redactie",
    generated: true,
    createdAt: date.iso,
    topicKey: topic.topicKey,
    ...(images.cover.credit ? { imageCredit: images.cover.credit } : {}),
  };
}

async function generateOne(topic, existingRoutes, date, existingTitles) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(topic, existingTitles) },
  ];

  let article;
  let errors = [];

  for (let attempt = 1; attempt <= CONFIG.maxAttempts; attempt += 1) {
    article = await callOpenAI(messages);
    errors = validateRoute(article, topic);

    if (errors.length === 0) break;

    log(`poging ${attempt} afgekeurd: ${errors.join("; ")}`);

    messages.push(
      { role: "assistant", content: JSON.stringify(article) },
      {
        role: "user",
        content: `Verbeter de route. Problemen: ${errors.join("; ")}. Behoud dezelfde JSON-structuur en bestemming, maar los deze punten op. Zorg dat de route 5 stops heeft, dat elke stop 2-3 activiteiten met prijs heeft en dat het totaal minimaal ${topic.days - 6} nachten telt.`,
      },
    );
  }

  if (errors.length > 0) {
    throw new Error(`validatie mislukt: ${errors.join("; ")}`);
  }

  const baseSlug = slugify(article.title) || slugify(`${topic.destination.name}-${topic.variant}`);
  let slug = baseSlug;
  let counter = 2;
  const taken = new Set(existingRoutes.map((route) => route.slug));

  while (taken.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const cover = await resolveImage(
    [article.coverImageQuery, topic.destination.imageQuery],
    `${slug}-cover`,
    topic.destination.region,
    { width: 1400 },
  );

  const stops = [];

  for (const [index, stop] of article.stops.entries()) {
    const image = await resolveImage(
      [stop.imageQuery, `${stop.name} ${topic.destination.name}`],
      `${slug}-${index + 1}`,
      topic.destination.region,
      { width: 900 },
    );

    stops.push(image);

    if (CONFIG.pixabayKey || CONFIG.pexelsKey) {
      await sleep(500);
    }
  }

  const stopCoords = [];

  for (const stop of article.stops) {
    const coords = await geocode(stop.name, topic.destination.country);
    stopCoords.push(coords ?? [0, 0]);
    await sleep(1100);
  }

  return buildRoute({
    article,
    topic,
    date,
    slug,
    images: { cover, stops },
    stopCoords,
  });
}

/* ------------------------------------------------------------------ */
/* Mock-modus                                                          */
/* ------------------------------------------------------------------ */

function mockArticle(topic) {
  const d = topic.destination;
  const paragraph = (subject) =>
    `${subject} is een onderdeel dat je vooraf rustig uitzoekt. Houd ruimte over voor een dag niets en plan niet elke dag een activiteit. Zo blijft de reis prettig als er iets anders loopt dan gepland.`;

  return {
    title: `Reisroute ${d.name}: ${topic.variant} langs de hoogtepunten`,
    kicker: "Rustig tempo, veel natuur",
    country: d.country,
    region: d.name,
    durationLabel: topic.variant,
    durationDays: topic.days,
    travelStyle: "Rustig tempo",
    budget: "€900 p.p.",
    budgetNote: "Exclusief internationale vlucht.",
    bestTime: "Voorjaar en najaar",
    startPoint: d.places[0],
    endPoint: d.places[d.places.length - 1],
    excerpt: `Een route van ${topic.variant} door ${d.name}, met vijf plekken, echte prijzen en genoeg ruimte om te blijven hangen.`,
    intro: [paragraph("De eerste indruk"), paragraph("De praktische kant")],
    highlights: ["Rustig tempo", "Veel natuur", "Eten op straat", "Goed te doen met de bus", "Mooie zonsondergangen"],
    stops: d.places.slice(0, 5).map((place, index) => ({
      name: place,
      area: d.name,
      dayLabel: `Dag ${index * 2 + 1}-${index * 2 + 2}`,
      nights: Math.max(1, Math.round((topic.days - 2) / 5)),
      description: paragraph(place),
      tip: "Boek de eerste nacht vooraf en laat de rest open.",
      imageAlt: `Beeld bij ${place}`,
      imageQuery: `${place} ${d.name}`,
      activities: [
        { title: `Wandeling door ${place}`, description: paragraph(place), price: "gratis" },
        { title: `Lokaal eten in ${place}`, description: paragraph(place), price: "€8-15" },
      ],
    })),
    practical: [
      { label: "Vervoer", value: paragraph("Vervoer") },
      { label: "Verblijf", value: paragraph("Verblijf") },
      { label: "Budget", value: paragraph("Budget") },
      { label: "Beste reistijd", value: paragraph("Seizoen") },
      { label: "Geld en internet", value: paragraph("Geld") },
    ],
    packing: ["Schoenen met grip", "Zonnebrand", "Regenjas", "Powerbank", "Waterfles", "Contant geld"],
    closingNote: paragraph("De slotnoot"),
    coverImageQuery: d.imageQuery,
  };
}

/* ------------------------------------------------------------------ */
/* Hoofdprogramma                                                      */
/* ------------------------------------------------------------------ */

async function main() {
  const routes = readRoutes();
  const date = formatDate(new Date());
  const topics = selectTopics(routes, CONFIG.count);

  if (topics.length === 0) {
    log("geen ongebruikte onderwerpen meer; breid data/topics.json uit");
    return;
  }

  if (!MOCK && !CONFIG.openaiKey) {
    throw new Error("OPENAI_API_KEY ontbreekt");
  }

  log(`start: ${topics.length} routes, model ${CONFIG.model}`);

  const locations = readJson(LOCATIONS_FILE);
  const existingTitles = routes.map((route) => route.title);
  let written = 0;
  let failed = 0;

  for (const topic of topics) {
    const label = `${topic.destination.name} (${topic.variant})`;

    try {
      let route;

      if (MOCK) {
        const article = mockArticle(topic);
        const slug = slugify(article.title);
        route = await buildRoute({
          article,
          topic,
          date,
          slug,
          images: {
            cover: { url: `/images/regio/${topic.destination.region}.jpg`, alt: "", credit: undefined },
            stops: article.stops.map(() => ({
              url: `/images/regio/${topic.destination.region}.jpg`,
              alt: "",
              credit: undefined,
            })),
          },
          stopCoords: article.stops.map(() => [0, 0]),
        });
      } else {
        route = await generateOne(topic, routes, date, existingTitles);
      }

      if (DRY_RUN) {
        log(`dry-run: ${route.slug} — ${route.title}`);
        continue;
      }

      writeJson(path.join(ROUTES_DIR, `${route.slug}.json`), route);
      routes.push(route);
      existingTitles.push(route.title);
      written += 1;

      const firstStop = route.stops.find((stop) => stop.coords[0] !== 0);

      if (firstStop) {
        const pin = {
          id: `${route.slug}-route`,
          name: route.startPoint,
          country: route.country,
          coords: firstStop.coords,
          slug: route.slug,
          type: "route",
          thumbnail: route.coverImage,
          excerpt: route.excerpt,
        };

        if (!locations.some((item) => item.id === pin.id)) {
          locations.push(pin);
        }
      }

      log(`geschreven: ${route.slug} (${label})`);
    } catch (error) {
      failed += 1;
      log(`mislukt: ${label} — ${String(error).slice(0, 300)}`);
    }
  }

  if (!DRY_RUN && written > 0) {
    writeJson(LOCATIONS_FILE, locations);
  }

  log(`klaar: ${written} routes geschreven, ${failed} mislukt`);

  if (written === 0 && failed > 0) {
    process.exitCode = 1;
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
