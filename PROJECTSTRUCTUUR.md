# Projectstructuur van Travel Monkey

Dit bestand laat zien waar alles staat. Je hoeft het niet uit je hoofd te
kennen. Gebruik het als je later een tekst, foto of route wilt aanpassen.

## De volledige map

```text
travel-monkey/
│
├── app/                          Alle pagina's van de website
│   ├── layout.tsx                 Header, footer, lettertypen en metadata
│   ├── page.tsx                   Homepage
│   ├── globals.css                Kleuren, animaties en kaartstijlen
│   ├── icon.svg                   Het aapje in het browsertabblad
│   ├── not-found.tsx              De pagina bij een 404-fout
│   ├── robots.ts                  Vertelt zoekmachines wat ze mogen bekijken
│   ├── sitemap.ts                 Lijst met alle pagina's voor Google
│   │
│   ├── reizen/
│   │   ├── page.tsx               Overzicht van alle reisroutes
│   │   └── [slug]/
│   │       └── page.tsx           Detailpagina van één route
│   │
│   ├── blog/
│   │   ├── page.tsx               Overzicht van alle verhalen
│   │   └── [slug]/
│   │       └── page.tsx           Detailpagina van één verhaal
│   │
│   ├── tips/
│   │   └── page.tsx               Praktische tips, paklijst en tips per plek
│   │
│   ├── regio/
│   │   └── [slug]/
│   │       └── page.tsx           Alle artikelen per werelddeel
│   │
│   └── over-ons/
│       └── page.tsx               Wie Travel Monkey is en hoe we schrijven
│
├── components/                   Herbruikbare onderdelen van de site
│   ├── site-header.tsx            Menu bovenaan, ook op mobiel
│   ├── site-footer.tsx            Footer onderaan
│   ├── home-hero.tsx              Grote blok bovenaan de homepage
│   ├── route-card.tsx             Kaartje voor een reisroute
│   ├── blog-card.tsx              Kaartje voor een verhaal
│   ├── route-filters.tsx          Filter op reisduur
│   ├── photo-gallery.tsx          Foto-galerij met vergrootvenster
│   ├── world-map.tsx              Wereldkaart met clusters en pins
│   ├── world-map-wrapper.tsx      Laadt de kaart pas in de browser
│   ├── world-map-section.tsx      Het hele kaartblok op de homepage
│   ├── route-map.tsx              Kaart met genummerde route-stops
│   ├── route-map-wrapper.tsx      Laadt de routemap pas in de browser
│   ├── mini-map.tsx               Kleine kaart bij een blog
│   ├── mini-map-wrapper.tsx       Laadt de mini-kaart in de browser
│   ├── location-card.tsx          Kaartje bij een gerelateerde plek
│   ├── section-heading.tsx        Terugkerende kop boven een sectie
│   ├── reveal.tsx                 Zachte fade-in bij scrollen
│   ├── marquee.tsx                Lopende tekstband
│   ├── monkey-mark.tsx            Het aapje als logo
│   └── icons.tsx                  Alle kleine iconen
│
├── scripts/
│   └── generate.mjs               Schrijft dagelijks nieuwe artikelen (OpenAI + Pixabay)
│
├── .github/
│   └── workflows/
│       └── generate.yml           De dagelijkse automatische run
│
├── data/                         Alle teksten en coördinaten
│   ├── topics.json                Onderwerpen waaruit de generator kiest
│   ├── locations.json             Alle pins op de wereldkaart
│   ├── routes/
│   │   └── bali-3-weken.json      De volledige Bali-route
│   └── blog/
│       ├── een-ochtend-in-ubud.json
│       └── nusa-penida-zonder-tour.json
│
├── lib/                          Code die de data inleest
│   ├── content.ts                 Leest de JSON-bestanden
│   ├── regions.ts                 De zeven regio's met titel en uitleg
│   ├── types.ts                   Beschrijft welke gegevens een route heeft
│   ├── site.ts                    Webadres, sitenaam en tagline
│   └── utils.ts                   Kleine hulpfuncties
│
├── public/
│   └── images/                   Alle foto's en de socialmedia-afbeelding
│       ├── regio/                 Reservecovers per werelddeel
│       ├── nusa-aerial.jpg
│       ├── ubud-green.jpg
│       ├── ...
│       ├── og-travel-monkey.jpg  De afbeelding bij delen op social media
│       └── CREDITS.md            Waar elke foto vandaan komt
│
├── package.json                  Lijst met benodigde software
├── package-lock.json             Exacte versies van die software
├── next.config.mjs               Instellingen van Next.js
├── tailwind.config.ts            Kleuren, lettertypen en animaties
├── postcss.config.mjs            Verwerkt de styling
├── tsconfig.json                 Instellingen voor TypeScript
├── .gitignore                    Bestanden die niet op GitHub horen
├── .nvmrc                        Gewenste Node.js-versie voor Vercel
├── PROJECTSTRUCTUUR.md           Dit bestand
└── README.md                     De stap-voor-stap uitleg voor Vercel
```

Tijdens het bouwen maakt Vercel automatisch tijdelijke mappen aan, zoals
`node_modules` en `.next`. Die staan expres niet in deze lijst en horen ook niet
op GitHub.

## Welke bestanden kun je aanpassen?

### Een tekst op de homepage

Open `app/page.tsx`. Daar staan de teksten van de homepage. Dit bestand bevat
ook code; pas alleen de tekst tussen aanhalingstekens of tussen
accolades aan. Twijfel je? Laat dit bestand dan liever met rust.

### De Bali-route

Open `data/routes/bali-3-weken.json`. Hier staan:

- de titel, het land en de duur;
- de introductie en de tips;
- alle acht stops met coördinaten;
- de activiteiten per stop en de prijzen;
- de foto-galerij;
- de praktische informatie en de paklijst.

De volgorde van de stops staat in het bestand. De kaart tekent automatisch een
lijn tussen de coördinaten, in dezelfde volgorde.

### De blogs

Open `data/blog/een-ochtend-in-ubud.json` of
`data/blog/nusa-penida-zonder-tour.json`. Elk verhaal heeft:

- een titel, citaat, datum en leestijd;
- een locatie met coördinaten voor de mini-kaart;
- een intro en meerdere secties met alinea's, lijstjes, citaten en foto's;
- een praktische tip;
- verwijzingen naar gerelateerde plekken.

### De pins op de wereldkaart

Open `data/locations.json`. Elk onderdeel heeft:

```json
{
  "id": "bali-3-weken",
  "name": "Bali",
  "country": "Indonesië",
  "coords": [-8.4095, 115.1889],
  "slug": "bali-3-weken",
  "type": "route",
  "thumbnail": "/images/nusa-aerial.jpg",
  "excerpt": "Korte tekst voor in de popup."
}
```

- `coords` zijn de breedte- en lengtegraad. De eerste waarde is de breedtegraad
  (noord/zuid), de tweede de lengtegraad (oost/west).
- `type` is `route` of `blog`.
- `slug` moet precies overeenkomen met de bestandsnaam van de route of blog.

Op lage zoom worden plekken in hetzelfde land als één cluster getoond. Zodra je
inzoomt, verschijnen de losse pins.

### Een foto vervangen

1. Open de map `public/images`.
2. Zoek de foto die je wilt vervangen.
3. Upload een nieuwe foto met **exact dezelfde bestandsnaam**. Bijvoorbeeld:
   `nusa-aerial.jpg`.
4. De site gebruikt daarna automatisch je nieuwe foto.

Wil je een andere bestandsnaam gebruiken? Pas dan de verwijzing in
`data/routes/...`, `data/blog/...` of `data/locations.json` aan naar de nieuwe
naam, inclusief `/images/` ervoor.

## Hoe de techniek in elkaar zit

- **Next.js 14 met App Router** maakt alle pagina's. De pagina's worden bij de
  bouw alvast als statische HTML gemaakt, waardoor de site snel is.
- **TypeScript** helpt om fouten in de code te voorkomen.
- **Tailwind CSS** regelt de opmaak, kleuren en animaties.
- **Leaflet + react-leaflet** tekent de kaarten. De kaarttegels komen van
  OpenStreetMap. Er is geen API-sleutel, account of betaald abonnement nodig.
- **Fraunces en Inter** worden meegeleverd via de npm-pakketten
  `@fontsource-variable/fraunces` en `@fontsource-variable/inter`. Daardoor zijn
  er geen externe lettertype-aanvragen nodig.
- **JSON-bestanden** vormen de content. Er is geen database en geen CMS. Dat
  houdt de site gratis en eenvoudig te hosten.
- **Geen environment variables.** Zoek je naar een `.env`-bestand? Dat bestaat
  hier bewust niet.

De site is getest als productiebuild. Vercel voert diezelfde bouw automatisch
uit na iedere wijziging op GitHub.

## Belangrijk bij het aanpassen van JSON

JSON is gevoelig voor leestekens. Let op:

- Tekst staat altijd tussen dubbele aanhalingstekens: `"zoals dit"`.
- Tussen twee onderdelen staat een komma, behalve na het laatste onderdeel.
- Getallen en coördinaten staan zonder aanhalingstekens.
- Gebruik geen slimme aanhalingstekens uit Word; gebruik de rechte `"` zoals op
  GitHub.
- Klik na je wijziging op **Commit changes**. Vercel bouwt de site daarna
  automatisch opnieuw.

Maak je een fout? Op GitHub kun je bij **History** een eerdere versie bekijken.
Vraag bij twijfel iemand met code-ervaring om mee te kijken.

## Foto's en licentie

Alle foto's in `public/images` komen van Unsplash en zijn gratis te gebruiken
onder de Unsplash-licentie. De fotografen en bronlinks staan in
[public/images/CREDITS.md](public/images/CREDITS.md). De socialmedia-afbeelding
`og-travel-monkey.jpg` is een bewerking van de foto van Nusa Penida.
