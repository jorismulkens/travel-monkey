#!/usr/bin/env node
/**
 * Dagelijkse contentgenerator voor Travel Monkey.
 *
 * Schrijft per run een aantal nieuwe reisgidsen en tipsartikelen, haalt daar
 * een foto bij via Pexels en zet ze als JSON in data/blog. De GitHub Action
 * committeert die bestanden, waarna Vercel opnieuw bouwt.
 *
 * Gebruik:
 *   node scripts/generate.mjs                 # echte run (5 artikelen)
 *   node scripts/generate.mjs --dry-run       # schrijven zonder op te slaan
 *   node scripts/generate.mjs --mock          # offline test met nepdata
 *
 * Omgevingsvariabelen:
 *   OPENAI_API_KEY   verplicht (behalve bij --mock)
 *   OPENAI_MODEL     standaard gpt-4o-mini
 *   PIXABAY_API_KEY  fotosleutel (aanbevolen); zonder key een reservecover per regio
 *   PEXELS_API_KEY   optioneel alternatief voor Pixabay
 *   POSTS_PER_DAY    standaard 5
 *   ROUTE_RATIO      aandeel routegidsen, standaard 0.6 (3 van 5)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const BLOG_DIR = path.join(DATA_DIR, "blog");
const LOCATIONS_FILE = path.join(DATA_DIR, "locations.json");
const TOPICS_FILE = path.join(DATA_DIR, "topics.json");

const args = new Set(process.argv.slice(2));
const MOCK = args.has("--mock");
const DRY_RUN = args.has("--dry-run");

const CONFIG = {
  count: clamp(Number(process.env.POSTS_PER_DAY ?? 5), 1, 10),
  routeRatio: clamp(Number(process.env.ROUTE_RATIO ?? 0.6), 0, 1),
  model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
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

function readPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson(path.join(BLOG_DIR, file)))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
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
  const display = new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  }).format(date);

  return { iso, display };
}

function countWords(post) {
  const chunks = [
    post.title,
    post.excerpt,
    ...(post.intro ?? []),
    ...(post.sections ?? []).flatMap((section) => [
      section.heading ?? "",
      ...(section.paragraphs ?? []),
      ...(section.list ?? []),
      section.quote ?? "",
    ]),
    post.tip ?? "",
  ];

  return chunks.join(" ").split(/\s+/).filter(Boolean).length;
}

/* ------------------------------------------------------------------ */
/* Onderwerpkeuze                                                      */
/* ------------------------------------------------------------------ */

function buildTopicPools(posts) {
  const topics = readJson(TOPICS_FILE);
  const usedKeys = new Set(posts.map((post) => post.topicKey).filter(Boolean));
  const destinationUsage = new Map();

  for (const post of posts) {
    if (!post.topicKey) continue;
    const key = String(post.topicKey).split(":")[0];
    destinationUsage.set(key, (destinationUsage.get(key) ?? 0) + 1);
  }

  const usage = (key) => destinationUsage.get(key) ?? 0;

  const routeCandidates = [];
  const tipCandidates = [];

  for (const destination of topics.destinations) {
    for (const variant of destination.routeVariants) {
      const topicKey = `${destination.key}:reisroute:${slugify(variant)}`;
      if (usedKeys.has(topicKey)) continue;
      routeCandidates.push({
        kind: "reisroute",
        topicKey,
        destination,
        variant,
        usage: usage(destination.key),
      });
    }

    for (const angle of topics.tipAngles) {
      const topicKey = `${destination.key}:tips:${angle.key}`;
      if (usedKeys.has(topicKey)) continue;
      tipCandidates.push({
        kind: "tips",
        topicKey,
        destination,
        angle,
        usage: usage(destination.key),
      });
    }
  }

  const byUsage = (a, b) => {
    if (a.usage !== b.usage) return a.usage - b.usage;
    return Math.random() - 0.5;
  };

  routeCandidates.sort(byUsage);
  tipCandidates.sort(byUsage);

  return { routeCandidates, tipCandidates };
}

function selectTopics(posts, count, routeRatio) {
  const { routeCandidates, tipCandidates } = buildTopicPools(posts);
  const routeTarget = Math.max(
    1,
    Math.min(count - 1, Math.round(count * routeRatio)),
  );
  const tipTarget = count - routeTarget;

  const picked = [];
  const usedDestinations = new Set();
  const usedRegions = new Set();

  function pick(pool) {
    const freshRegion = pool.find(
      (candidate) =>
        !usedDestinations.has(candidate.destination.key) &&
        !usedRegions.has(candidate.destination.region),
    );
    const freshDestination = pool.find(
      (candidate) => !usedDestinations.has(candidate.destination.key),
    );
    const candidate = freshRegion ?? freshDestination ?? pool[0];

    if (!candidate) return undefined;

    usedDestinations.add(candidate.destination.key);
    usedRegions.add(candidate.destination.region);
    pool.splice(pool.indexOf(candidate), 1);

    return candidate;
  }

  for (let i = 0; i < routeTarget; i += 1) {
    const candidate = pick(routeCandidates);
    if (candidate) picked.push(candidate);
  }

  for (let i = 0; i < tipTarget; i += 1) {
    const candidate = pick(tipCandidates);
    if (candidate) picked.push(candidate);
  }

  // Vul aan als een van beide pools leeg raakte.
  while (picked.length < count) {
    const candidate = pick(routeCandidates) ?? pick(tipCandidates);
    if (!candidate) break;
    picked.push(candidate);
  }

  return picked.slice(0, count);
}

/* ------------------------------------------------------------------ */
/* Prompt en schema                                                    */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `Je bent reisredacteur bij Travel Monkey, een Nederlands reisblog.
Je schrijft lange, praktische reisgidsen en tipsartikelen in het Nederlands.

Schrijfstijl:
- Je-vorm. Gebruik nooit "ik", "mijn", "wij" of "onze", en doe niet alsof je er zelf was. Je schrijft als gids.
- Nuchter, warm en concreet. Geen superlatieven zoals "paradijs", "parel", "hidden gem" of "bucketlist".
- Korte alinea's van twee tot vier zinnen. Wissel tekst af met opsommingen.
- Geen verzonnen namen van hotels, restaurants, tours of stranden. Noem hooguit het type plek ("guesthouse", "hostel", "familierestaurant").
- Geen exacte prijzen als je ze niet zeker weet: gebruik bandbreedtes ("ongeveer 15-25 euro per nacht") en zeg dat prijzen kunnen afwijken.
- Geen openingstijden, visa-eisen of veiligheidsgaranties. Zeg dan: "check dit voor vertrek bij de officiële instanties".
- Geen clichés over gastvrije locals of "de cultuur proeven".
- Geen verwijzingen naar AI, taalmodellen of het genereren van tekst.
- Nederlands, met correcte spelling en zonder Engelse uitdrukkingen waar een Nederlands woord bestaat.

Structuur:
- Elk artikel heeft een pakkende titel, een korte subtitel en een samenvatting van twee zinnen.
- Gebruik 5 tot 9 tussenkoppen. Onder elke kop staan alinea's en/of een opsomming.
- Minstens twee secties bevatten een opsomming met concrete stappen of tips.
- Sluit af met een praktische tip van 2 tot 4 zinnen.
- Lever alleen JSON op volgens het gevraagde schema.`;

function buildUserPrompt(topic, existingTitles) {
  const destination = topic.destination;
  const regionLabel = REGION_LABELS[destination.region];
  const places = destination.places.join(", ");

  if (topic.kind === "reisroute") {
    return `Schrijf een complete reisroute voor ${destination.name} (${destination.country}), regio ${regionLabel}.
Duur van deze route: ${topic.variant}.
Plaatsen die in de route voor kunnen komen: ${places}.

Opbouw die je aanhoudt:
1. "Waarom ${destination.name}" - wat de reis bijzonder maakt, zonder superlatieven.
2. "Beste reistijd" - seizoenen, weer en drukte.
3. "Hoe kom je er" - vliegveld, visa voor zover algemeen bekend, eerste transfer.
4. "De route in ${topic.variant}" - verdeel de route in 5 tot 7 etappes. Elke etappe krijgt een eigen kop met dagen en plaatsnaam, bijvoorbeeld "Dag 1-2: ...". Beschrijf per etappe wat je doet, hoe lang je blijft en waarom die verdeling werkt.
5. "Vervoer" - trein, bus, huurauto of binnenlandse vlucht, met bandbreedtes voor kosten.
6. "Budget" - wat een dag ongeveer kost en waaraan je het uitgeeft.
7. "Waar slapen en eten" - type accommodatie en eetgewoontes, zonder namen.
8. "Tips" - 4 tot 6 concrete tips.

Titel: begin met "Reisroute" of "Rondreis", noem de duur en één onderscheidende
hoek. Noem de landnaam niet twee keer.
Lengte: 1000 tot 1400 woorden.
Titels van bestaande artikelen (niet herhalen): ${existingTitles.join(" | ")}`;
  }

  const angle = topic.angle;
  return `Schrijf een tipsartikel over ${angle.label.toLowerCase()} in ${destination.name} (${destination.country}), regio ${regionLabel}.
Invalshoek: ${angle.brief}
Plaatsen die ter sprake kunnen komen: ${places}.

Opbouw:
1. "Wat je moet weten" - het belangrijkste in het kort.
2. Een sectie per deelonderwerp dat bij deze invalshoek hoort (2 tot 4 secties), met concrete bedragen in bandbreedtes en praktische stappen.
3. "Veelgemaakte fouten" - 4 tot 6 punten waar het vaak misgaat.
4. "Praktische checklist" - een korte opsomming om mee te nemen.

Titel: begin met "Tips voor" of met het onderwerp, gevolgd door de bestemming.
Lengte: 700 tot 1000 woorden.
Titels van bestaande artikelen (niet herhalen): ${existingTitles.join(" | ")}`;
}

const RESPONSE_SCHEMA = {
  name: "travel_article",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "subtitle",
      "excerpt",
      "category",
      "country",
      "destination",
      "intro",
      "sections",
      "tip",
      "imageQuery",
      "imageAlt",
      "readingTime",
    ],
    properties: {
      title: { type: "string" },
      subtitle: { type: "string" },
      excerpt: { type: "string" },
      category: { type: "string" },
      country: { type: "string" },
      destination: { type: "string" },
      intro: {
        type: "array",
        items: { type: "string" },
      },
      sections: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["heading", "paragraphs", "list", "quote"],
          properties: {
            heading: { type: "string" },
            paragraphs: {
              type: "array",
              items: { type: "string" },
            },
            list: {
              type: "array",
              items: { type: "string" },
            },
            quote: {
            anyOf: [{ type: "string" }, { type: "null" }],
          },
          },
        },
      },
      tip: { type: "string" },
      imageQuery: { type: "string" },
      imageAlt: { type: "string" },
      readingTime: { type: "string" },
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
    response_format: {
      type: "json_schema",
      json_schema: RESPONSE_SCHEMA,
    },
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
      const retryable = /429|500|502|503|timeout|fetch failed/i.test(
        String(error),
      );

      if (!retryable || attempt === 3) break;

      await sleep(2000 * attempt);
    }
  }

  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  "parel",
  "paradijs",
  "lorem ipsum",
  "plaatsnaam",
  "{{",
];

function validateArticle(article, kind) {
  const errors = [];
  const text = [
    article.title,
    article.subtitle,
    article.excerpt,
    ...article.intro,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...section.list,
      section.quote ?? "",
    ]),
    article.tip,
  ]
    .join(" ")
    .toLowerCase();

  const words = text.split(/\s+/).filter(Boolean).length;

  if (!article.title || article.title.length < 25 || article.title.length > 110) {
    errors.push(`titel moet 25-110 tekens zijn (nu ${article.title?.length})`);
  }

  if (!article.excerpt || article.excerpt.length < 70 || article.excerpt.length > 280) {
    errors.push("samenvatting moet 70-280 tekens zijn");
  }

  if (!Array.isArray(article.intro) || article.intro.length < 2 || article.intro.length > 3) {
    errors.push("intro moet 2 of 3 alinea's hebben");
  }

  if (!Array.isArray(article.sections) || article.sections.length < 5 || article.sections.length > 10) {
    errors.push("artikel moet 5-10 secties hebben");
  }

  for (const section of article.sections ?? []) {
    const body = [...(section.paragraphs ?? []), ...(section.list ?? [])].join(" ");
    if (!section.heading || body.trim().length < 40) {
      errors.push(`sectie "${section.heading ?? "?"}" mist inhoud`);
    }
  }

  if (!article.tip || article.tip.length < 40) {
    errors.push("praktische tip is te kort");
  }

  if (words < (kind === "reisroute" ? 800 : 600)) {
    errors.push(`te weinig tekst (${words} woorden)`);
  }

  if (FIRST_PERSON.test(text)) {
    errors.push("gebruikt ik/wij/mijn/onze; schrijf in de je-vorm");
  }

  for (const phrase of BANNED) {
    if (text.includes(phrase)) errors.push(`bevat verboden frase: ${phrase}`);
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Foto's: zoeken, downloaden en verkleinen                            */
/* ------------------------------------------------------------------ */

/**
 * Pixabay staat hotlinken niet toe: afbeeldingen moeten op je eigen server
 * staan. Daarom downloaden we de foto, verkleinen hem naar 1400px en zetten
 * hem als WebP in public/images/posts.
 */
export async function downloadImage(url, slug) {
  const response = await fetch(url, {
    headers: { "User-Agent": "TravelMonkeyBot/1.0" },
  });

  if (!response.ok) {
    throw new Error(`download gaf ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.startsWith("image/")) {
    throw new Error("reactie is geen afbeelding");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const { default: sharp } = await import("sharp");

  const webp = await sharp(buffer)
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();

  fs.mkdirSync(CONFIG.imagesDir, { recursive: true });
  fs.writeFileSync(path.join(CONFIG.imagesDir, `${slug}.webp`), webp);

  return `/images/posts/${slug}.webp`;
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
      credit: {
        name: hit.user,
        url: hit.pageURL,
        source: "Pixabay",
      },
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

async function resolveImage(article, destination, slug) {
  const fallback = {
    url: `/images/regio/${destination.region}.jpg`,
    alt: article.imageAlt || `Reisbeeld bij ${destination.name}`,
    credit: undefined,
  };

  const queries = [article.imageQuery, destination.imageQuery]
    .filter(Boolean)
    .map((query) => String(query).trim())
    .filter((query, index, list) => list.indexOf(query) === index)
    .slice(0, 2);

  const provider = CONFIG.pixabayKey
    ? searchPixabay
    : CONFIG.pexelsKey
      ? searchPexels
      : undefined;

  if (!provider) return fallback;

  for (const query of queries) {
    let candidates = [];

    try {
      candidates = await provider(query);
    } catch (error) {
      log(`fotozoekopdracht mislukt: ${String(error).slice(0, 160)}`);
      continue;
    }

    for (const candidate of candidates.slice(0, 5)) {
      try {
        const localUrl = await downloadImage(candidate.url, slug);

        return {
          url: localUrl,
          alt: article.imageAlt || `Reisbeeld bij ${destination.name}`,
          credit: candidate.credit,
        };
      } catch (error) {
        log(`foto overgeslagen: ${String(error).slice(0, 120)}`);
      }
    }
  }

  return fallback;
}

/* ------------------------------------------------------------------ */
/* Geocoding (voor de wereldkaart)                                     */
/* ------------------------------------------------------------------ */

async function geocode(place, country) {
  const query = `${place}, ${country}`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "TravelMonkeyBot/1.0 (https://travel-monkey.vercel.app)",
        },
      },
    );

    if (!response.ok) return undefined;

    const results = await response.json();
    const first = results?.[0];

    if (!first) return undefined;

    return [Number(first.lat), Number(first.lon)];
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Artikel bouwen                                                      */
/* ------------------------------------------------------------------ */

function buildPost({ article, topic, date, image, coords, slug }) {
  const destination = topic.destination;
  const regionLabel = REGION_LABELS[destination.region];
  const words = countWords(article);
  const minutes = Math.max(4, Math.round(words / 200));

  return {
    slug,
    title: article.title.trim(),
    subtitle: article.subtitle?.trim() || `Reisgids voor ${destination.name}`,
    excerpt: article.excerpt.trim(),
    date: date.iso,
    displayDate: date.display,
    readingTime: `${minutes} minuten`,
    category: regionLabel,
    coverImage: image.url,
    coverAlt: image.alt,
    location: {
      name: article.destination?.trim() || destination.name,
      country: article.country?.trim() || destination.country,
      coords: coords ?? [0, 0],
    },
    intro: article.intro.map((paragraph) => paragraph.trim()),
    sections: article.sections.map((section) => ({
      heading: section.heading?.trim(),
      paragraphs: (section.paragraphs ?? []).map((p) => p.trim()),
      list: (section.list ?? []).map((item) => item.trim()),
      quote: section.quote ? section.quote.trim() : undefined,
    })),
    tip: article.tip.trim(),
    relatedLocationIds: [],
    relatedRouteSlug: "",
    region: destination.region,
    kind: topic.kind,
    author: "Redactie",
    generated: true,
    topicKey: topic.topicKey,
    ...(image.credit ? { imageCredit: image.credit } : {}),
  };
}

async function generateOne(topic, existingPosts, date, existingTitles) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(topic, existingTitles.slice(-40)) },
  ];

  let article;
  let errors = [];

  for (let attempt = 1; attempt <= CONFIG.maxAttempts; attempt += 1) {
    article = await callOpenAI(messages);
    errors = validateArticle(article, topic.kind);

    if (errors.length === 0) break;

    log(`poging ${attempt} afgekeurd: ${errors.join("; ")}`);
    messages.push(
      { role: "assistant", content: JSON.stringify(article) },
      {
        role: "user",
        content: `Verbeter het artikel. Problemen: ${errors.join("; ")}. Behoud dezelfde JSON-structuur en onderwerp, maar los deze punten op.`,
      },
    );
  }

  if (errors.length > 0) {
    throw new Error(`validatie mislukt: ${errors.join("; ")}`);
  }

  const baseSlug = slugify(article.title) || slugify(`${topic.destination.name}-${topic.kind}`);
  let slug = baseSlug;
  let counter = 2;
  const takenSlugs = new Set(existingPosts.map((post) => post.slug));

  while (takenSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const image = await resolveImage(article, topic.destination, slug);
  const coords = await geocode(
    article.destination || topic.destination.name,
    topic.destination.country,
  );

  await sleep(1200); // Nominatim: maximaal één verzoek per seconde

  return buildPost({ article, topic, date, image, coords, slug });
}

/* ------------------------------------------------------------------ */
/* Mock-modus (offline testen zonder API-sleutels)                     */
/* ------------------------------------------------------------------ */

function mockArticle(topic) {
  const name = topic.destination.name;
  const paragraph = (subject) =>
    `${subject} is een van de onderdelen die je vooraf kunt uitzoeken. Plan het rustig in en houd ruimte over voor een dag niets. Zo blijft de reis leuk als er iets anders loopt dan gepland.`;

  return {
    title:
      topic.kind === "reisroute"
        ? `Reisroute ${name}: ${topic.variant} door ${topic.destination.country}`
        : `${topic.angle.label} in ${name}: wat je vooraf wilt weten`,
    subtitle: `Een praktische gids voor ${name}`,
    excerpt: `Een compacte gids voor ${name}, met een route, vervoer, budget en de dingen die je vooraf regelt. Zo houd je tijd over voor de plekken zelf.`,
    category: REGION_LABELS[topic.destination.region],
    country: topic.destination.country,
    destination: name,
    intro: [paragraph("De eerste indruk"), paragraph("De praktische kant")],
    sections: [
      { heading: "Waarom deze bestemming", paragraphs: [paragraph("De bestemming")], list: [], quote: null },
      { heading: "Beste reistijd", paragraphs: [paragraph("Het seizoen")], list: [], quote: null },
      { heading: "Hoe kom je er", paragraphs: [paragraph("De aankomst")], list: [], quote: null },
      {
        heading: "De route",
        paragraphs: [paragraph("De route")],
        list: topic.destination.places.slice(0, 5),
        quote: null,
      },
      { heading: "Vervoer", paragraphs: [paragraph("Vervoer ter plaatse")], list: [], quote: null },
      { heading: "Budget", paragraphs: [paragraph("Het budget")], list: [], quote: null },
      { heading: "Tips", paragraphs: [paragraph("De voorbereiding")], list: [], quote: null },
    ],
    tip: "Boek het eerste en laatste verblijf vooraf en laat de dagen ertussen open. Zo kun je schuiven als iets langer leuk blijft dan verwacht.",
    imageQuery: topic.destination.imageQuery,
    imageAlt: `Reisbeeld bij ${name}`,
    readingTime: "7 minuten",
  };
}

/* ------------------------------------------------------------------ */
/* Hoofdprogramma                                                      */
/* ------------------------------------------------------------------ */

async function main() {
  if (!fs.existsSync(BLOG_DIR)) throw new Error(`Map ontbreekt: ${BLOG_DIR}`);

  const posts = readPosts();
  const date = formatDate(new Date());
  const topics = selectTopics(posts, CONFIG.count, CONFIG.routeRatio);

  if (topics.length === 0) {
    log("geen ongebruikte onderwerpen meer; breid data/topics.json uit");
    return;
  }

  if (!MOCK && !CONFIG.openaiKey) {
    throw new Error("OPENAI_API_KEY ontbreekt");
  }

  log(
    `start: ${topics.length} artikelen (${topics.filter((t) => t.kind === "reisroute").length} routes, ${topics.filter((t) => t.kind === "tips").length} tips), model ${CONFIG.model}`,
  );

  const locations = readJson(LOCATIONS_FILE);
  const existingTitles = posts.map((post) => post.title);
  let written = 0;
  let failed = 0;

  for (const topic of topics) {
    const label = `${topic.destination.name} (${topic.kind})`;

    try {
      const article = MOCK ? mockArticle(topic) : undefined;
      const post = MOCK
        ? buildMockPost(topic, article, date, existingTitles)
        : await generateOne(topic, posts, date, existingTitles);

      if (DRY_RUN) {
        log(`dry-run: ${post.slug} — ${post.title}`);
        continue;
      }

      writeJson(path.join(BLOG_DIR, `${post.slug}.json`), post);
      posts.push(post);
      existingTitles.push(post.title);
      written += 1;

      if (post.location.coords[0] !== 0) {
        const pin = {
          id: `${post.slug}-blog`,
          name: post.location.name,
          country: post.location.country,
          coords: post.location.coords,
          slug: post.slug,
          type: "blog",
          thumbnail: post.coverImage,
          excerpt: post.excerpt,
        };

        if (!locations.some((item) => item.id === pin.id)) {
          locations.push(pin);
        }
      }

      log(`geschreven: ${post.slug} (${label})`);
    } catch (error) {
      failed += 1;
      log(`mislukt: ${label} — ${String(error).slice(0, 300)}`);
    }
  }

  if (!DRY_RUN && written > 0) {
    writeJson(LOCATIONS_FILE, locations);
  }

  log(`klaar: ${written} geschreven, ${failed} mislukt`);

  if (written === 0 && failed > 0) {
    process.exitCode = 1;
  }
}

function buildMockPost(topic, article, date, existingTitles) {
  const baseSlug = slugify(article.title);
  let slug = baseSlug;
  let counter = 2;
  while (existingTitles.some((title) => slugify(title) === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return buildPost({
    article,
    topic,
    date,
    image: {
      url: `/images/regio/${topic.destination.region}.jpg`,
      alt: article.imageAlt,
      credit: undefined,
    },
    coords: [0, 0],
    slug,
  });
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
