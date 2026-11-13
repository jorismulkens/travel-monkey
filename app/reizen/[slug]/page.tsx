import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Compass,
  Leaf,
  MapPin,
  Sparkles,
  Sun,
  Wallet,
} from "@/components/icons";
import { PhotoGallery } from "@/components/photo-gallery";
import { Reveal } from "@/components/reveal";
import { RouteMapWrapper } from "@/components/route-map-wrapper";
import { SectionHeading } from "@/components/section-heading";
import {
  getAllBlogPosts,
  getAllRoutes,
  getRoute,
} from "@/lib/content";

interface RoutePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllRoutes().map((route) => ({ slug: route.slug }));
}

export function generateMetadata({ params }: RoutePageProps): Metadata {
  const route = getRoute(params.slug);

  if (!route) {
    return {
      title: "Route niet gevonden",
    };
  }

  return {
    title: route.title,
    description: route.excerpt,
    alternates: {
      canonical: `/reizen/${route.slug}`,
    },
    openGraph: {
      type: "article",
      title: route.title,
      description: route.excerpt,
      images: [
        {
          url: route.coverImage,
          alt: route.coverAlt,
        },
      ],
    },
  };
}

export default function RouteDetailPage({ params }: RoutePageProps) {
  const route = getRoute(params.slug);

  if (!route) {
    notFound();
  }

  const blogPosts = getAllBlogPosts().slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: route.title,
    description: route.excerpt,
    touristType: "Backpackers",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: route.stops.length,
      itemListElement: route.stops.map((stop) => ({
        "@type": "ListItem",
        position: stop.number,
        name: stop.name,
        description: stop.description,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-wide pt-6">
        <nav
          className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-jungle-600"
          aria-label="Kruimelpad"
        >
          <Link href="/" className="transition-colors hover:text-sunset-700">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/reizen"
            className="transition-colors hover:text-sunset-700"
          >
            Reizen
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-jungle-900">Bali, 21 dagen</span>
        </nav>
      </div>

      <section className="relative overflow-hidden pb-14 pt-8 sm:pb-20 sm:pt-12">
        <div
          className="pointer-events-none absolute -left-40 top-14 h-[28rem] w-[28rem] rounded-full bg-sunset-100/70 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-wide relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_0.97fr]">
            <div>
              <p className="eyebrow">{route.kicker}</p>
              <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[0.99] tracking-[-0.045em] text-jungle-950 sm:text-[4rem] lg:text-[4.3rem]">
                {route.title.split(":")[0]}:{" "}
                <span className="italic text-sunset-600">
                  {route.title.split(":")[1]?.trim()}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.01rem] leading-8 text-jungle-800/80">
                {route.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="tag">
                  <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                  {route.country}
                </span>
                <span className="tag">
                  <Calendar className="h-3.5 w-3.5 text-sunset-600" />
                  {route.durationLabel}
                </span>
                <span className="tag">
                  <Wallet className="h-3.5 w-3.5 text-sunset-600" />
                  {route.budget}
                </span>
                <span className="tag">
                  <Sun className="h-3.5 w-3.5 text-sunset-600" />
                  {route.bestTime}
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#kaart"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-jungle-900 px-6 py-3.5 text-sm font-semibold text-sand-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-jungle-800"
                >
                  <Compass className="h-4 w-4 text-sunset-300" />
                  Bekijk de kaart
                </a>
                <a
                  href="#route"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-jungle-900/20 px-6 py-3.5 text-sm font-semibold text-jungle-900 transition-all duration-300 hover:border-jungle-900/40 hover:bg-sand-100"
                >
                  Naar de dag-tot-dag
                  <ArrowUpRight className="h-4 w-4 text-sunset-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
              <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-[2.5rem] border-[5px] border-sand-50 bg-sand-200 shadow-card">
                <Image
                  src={route.coverImage}
                  alt={route.coverAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 43vw, 90vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-jungle-950/55 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sand-200">
                      {route.region}
                    </p>
                    <p className="mt-1 font-display text-xl font-medium italic text-white">
                      {route.startPoint} → {route.endPoint}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur">
                    <MapPin className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="absolute -left-2 top-8 z-10 -rotate-6 rounded-2xl bg-sand-50 px-4 py-3 text-center shadow-sticker">
                <p className="font-display text-2xl font-semibold leading-none text-jungle-950">
                  8
                </p>
                <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-jungle-600">
                  stops
                </p>
              </div>
              <div className="absolute -right-2 top-1/3 z-10 rotate-6 rounded-full bg-sunset-500 px-4 py-3 text-center shadow-sticker">
                <p className="font-display text-2xl font-semibold leading-none text-white">
                  21
                </p>
                <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-sunset-100">
                  dagen
                </p>
              </div>
              <div className="absolute -bottom-6 left-4 z-10 flex items-center gap-2 rounded-full border border-jungle-900/10 bg-sand-50 px-4 py-2.5 shadow-sticker">
                <Sparkles className="h-4 w-4 text-sunset-500" />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-jungle-700">
                  Zelf gelopen in 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-wide">
          <div className="grid gap-8 border-y border-jungle-900/10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <div>
                <p className="flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-jungle-500">
                  <Calendar className="h-3.5 w-3.5 text-sunset-500" />
                  Duur
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold text-jungle-950">
                  {route.durationDays} dagen
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-jungle-500">
                  <MapPin className="h-3.5 w-3.5 text-sunset-500" />
                  Land
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold text-jungle-950">
                  {route.country}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-jungle-500">
                  <Wallet className="h-3.5 w-3.5 text-sunset-500" />
                  Budget
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold text-jungle-950">
                  {route.budget}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-jungle-500">
                  <Clock className="h-3.5 w-3.5 text-sunset-500" />
                  Tempo
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold leading-tight text-jungle-950">
                  {route.travelStyle}
                </p>
              </div>
            </div>
            <p className="max-w-lg text-sm leading-7 text-jungle-700/75 lg:justify-self-end">
              {route.budgetNote} De dagen zijn een ritme, geen strak schema:
              schuif gerust een dag op als je ergens langer wilt blijven.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="eyebrow">Waarom deze route</p>
              <h2 className="mt-4 max-w-lg font-display text-[2.2rem] font-semibold leading-[1.07] tracking-[-0.035em] text-jungle-950 sm:text-[3rem]">
                Van koel groen naar{" "}
                <span className="italic text-sunset-600">zout water.</span>
              </h2>
              <div className="prose-tm mt-6 max-w-xl">
                {route.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-jungle-900/10 bg-sand-100/70 p-7 sm:p-9">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-jungle-900/10"
                aria-hidden="true"
              />
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sunset-700">
                Zes dingen die ik zo weer zou doen
              </p>
              <ul className="mt-5 grid gap-x-5 gap-y-3 sm:grid-cols-2">
                {route.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm leading-6 text-jungle-800"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-jungle-900 text-sand-50">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-jungle-900/10 pt-5">
                <p className="font-display text-lg font-medium italic leading-7 text-jungle-800">
                  &ldquo;{route.closingNote}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="kaart"
        className="scroll-mt-24 overflow-hidden bg-jungle-950 py-20 text-sand-100 sm:py-24"
      >
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-sunset-300 before:bg-sunset-400">
                De route op de kaart
              </p>
              <h2 className="mt-4 max-w-xl font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-sand-50 sm:text-[3.1rem]">
                Acht stops, één{" "}
                <span className="italic text-sunset-400">kronkelige lijn.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-sand-200/70">
                Klik op een genummerde pin voor de foto en het dagdeel. De lijn
                laat zien hoe ik reisde, niet hoe jij het moet doen.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full border border-sand-100/20 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-sand-200">
                8 stops
              </span>
              <span className="rounded-full border border-sand-100/20 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-sand-200">
                21 dagen
              </span>
            </div>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border-[6px] border-sand-50 bg-sand-200 shadow-card sm:rounded-[2.25rem] sm:border-8">
            <div className="h-[28rem] sm:h-[36rem] lg:h-[41rem]">
              <RouteMapWrapper stops={route.stops} />
            </div>
            <div className="pointer-events-none absolute left-4 top-4 z-[500] inline-flex items-center gap-2 rounded-full bg-jungle-950/90 px-4 py-2.5 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-sand-50 backdrop-blur">
              <Compass className="h-4 w-4 text-sunset-400" />
              Bali · 8°30′S
            </div>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {route.stops.map((stop) => (
              <a
                key={stop.id}
                href={`#stop-${stop.id}`}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-sand-100/15 bg-sand-100/5 px-3.5 py-2 text-[0.68rem] font-medium text-sand-200 transition-colors hover:border-sunset-400/60 hover:bg-sunset-500/15 hover:text-sand-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sand-50 text-[0.58rem] font-bold text-jungle-900">
                  {stop.number}
                </span>
                {stop.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="route" className="scroll-mt-24 section-space">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:gap-14">
            <aside className="self-start lg:sticky lg:top-28">
              <p className="eyebrow">Dag tot dag</p>
              <h2 className="mt-4 font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-jungle-950 sm:text-[2.9rem]">
                De route, stap voor stap.
              </h2>
              <p className="mt-5 text-sm leading-7 text-jungle-700/75">
                Ik heb de dagen zo verdeeld dat je nergens alleen maar doorheen
                rijdt. Slaap op acht plekken en houd ruimte over voor niets
                doen.
              </p>

              <nav
                className="mt-7 hidden border-t border-jungle-900/10 pt-5 lg:block"
                aria-label="Spring naar een stop"
              >
                <ol className="space-y-1">
                  {route.stops.map((stop) => (
                    <li key={stop.id}>
                      <a
                        href={`#stop-${stop.id}`}
                        className="group flex items-baseline gap-3 rounded-lg py-2 text-sm text-jungle-700 transition-colors hover:text-sunset-700"
                      >
                        <span className="font-display text-xs font-semibold text-sunset-600">
                          {String(stop.number).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="font-medium">{stop.name}</span>
                          <span className="ml-1.5 text-xs text-jungle-500">
                            {stop.dayLabel}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="relative space-y-8 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-jungle-900/15">
              {route.stops.map((stop) => (
                <article
                  key={stop.id}
                  id={`stop-${stop.id}`}
                  className="relative scroll-mt-28 pl-12 sm:pl-16"
                >
                  <span className="absolute left-0 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-shell bg-jungle-900 text-xs font-bold text-sand-50 shadow-soft">
                    {stop.number}
                  </span>

                  <div className="overflow-hidden rounded-[1.8rem] border border-jungle-900/10 bg-sand-50 shadow-[0_20px_50px_-40px_rgba(27,42,35,0.5)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-sand-200 sm:aspect-[16/9] lg:aspect-[16/7]">
                      <Image
                        src={stop.image}
                        alt={stop.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 900px, 100vw"
                        className="object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-jungle-950/55 via-transparent to-transparent"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-5">
                        <span className="rounded-full bg-sand-50/95 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-jungle-900 backdrop-blur">
                          {stop.dayLabel}
                        </span>
                        <span className="rounded-full bg-jungle-950/70 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-sand-100 backdrop-blur">
                          {stop.nights}{" "}
                          {stop.nights === 1 ? "nacht" : "nachten"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10">
                      <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                          <MapPin className="h-3 w-3" />
                          {stop.area}
                        </p>
                        <h3 className="mt-2 font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-jungle-950 sm:text-[2.35rem]">
                          {stop.name}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-jungle-700/80 sm:text-[0.95rem] sm:leading-8">
                          {stop.description}
                        </p>
                      </div>

                      <div className="mt-7">
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                          Dingen om te doen
                        </p>
                        <div className="mt-3 grid gap-2.5 md:grid-cols-2">
                          {stop.activities.map((activity) => (
                            <div
                              key={activity.title}
                              className="rounded-2xl border border-jungle-900/10 bg-sand-100/60 p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                                <h4 className="text-sm font-semibold text-jungle-950">
                                  {activity.title}
                                </h4>
                                <span className="shrink-0 rounded-full bg-sand-50 px-2.5 py-1 text-[0.6rem] font-semibold text-sunset-700 ring-1 ring-jungle-900/10">
                                  {activity.price}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs leading-5 text-jungle-700/75">
                                {activity.description}
                              </p>
                            </div>
                          ))}

                          <div className="flex gap-3 rounded-2xl border border-sunset-200/70 bg-sunset-50 p-4">
                            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-sunset-600" />
                            <p className="text-xs leading-5 text-jungle-800">
                              <span className="font-semibold text-jungle-950">
                                Mijn tip:{" "}
                              </span>
                              {stop.tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Uit mijn camera"
            title={
              <>
                Geen filter, wel{" "}
                <span className="italic text-sunset-600">natte voeten.</span>
              </>
            }
            description="De foto's die ik op mijn telefoon bewaarde. Soms wazig, soms te donker, maar altijd een herinnering aan een echte dag."
          />
          <div className="mt-10">
            <PhotoGallery images={route.gallery} />
          </div>
        </div>
      </section>

      <section className="bg-sand-100/70 py-20 sm:py-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Praktisch"
            title={
              <>
                Voordat je je{" "}
                <span className="italic text-sunset-600">rugzak pakt.</span>
              </>
            }
            description="De dingen die ik graag van tevoren had geweten. Geen uitputtende lijst, wel de punten die echt verschil maken."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {route.practical.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-jungle-900/10 bg-sand-50 p-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sunset-500" />
                    <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-jungle-600">
                      {item.label}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-6 text-jungle-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <aside className="relative flex flex-col overflow-hidden rounded-[2rem] bg-jungle-900 p-7 text-sand-100 sm:p-8">
              <div
                className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-sand-100/10"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-sunset-300">
                  <Wallet className="h-3.5 w-3.5" />
                  Wat ik uitgaf
                </p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-sand-50">
                  {route.budget}
                </p>
                <p className="mt-2 text-xs leading-5 text-sand-200/70">
                  {route.budgetNote}
                </p>

                <div className="mt-7 border-t border-sand-100/15 pt-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-sand-300/70">
                    Wat ik meenam
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {route.packing.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-sand-200/85"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sunset-500/20 text-sunset-300">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-wide">
          <div className="rounded-[2rem] border border-sunset-200/80 bg-sunset-50 px-6 py-12 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-16">
            <p className="font-display text-[1.7rem] font-medium italic leading-[1.3] tracking-[-0.02em] text-jungle-900 sm:text-[2.3rem]">
              &ldquo;{route.closingNote}&rdquo;
            </p>
            <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sunset-700">
              Mila · Travel Monkey
            </p>
          </div>

          <div className="mt-20">
            <SectionHeading
              eyebrow="Verder lezen"
              title="De verhalen achter de stops."
              action={{ href: "/blog", label: "Alle verhalen" }}
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-jungle-900/10 pt-7">
            <Link
              href="/reizen"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-jungle-800 transition-colors hover:text-sunset-600"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Alle reisroutes
            </Link>
            <a
              href="#kaart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-jungle-800 transition-colors hover:text-sunset-600"
            >
              Terug naar de kaart
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
