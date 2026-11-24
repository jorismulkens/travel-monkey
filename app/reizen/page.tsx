import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  Sparkles,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { RouteCard } from "@/components/route-card";
import { getAllRoutes } from "@/lib/content";
import { regions } from "@/lib/regions";
import type { RegionSlug } from "@/lib/types";

export const metadata: Metadata = {
  title: "Reisroutes",
  description:
    "Complete reisroutes per werelddeel: met stops, activiteiten, prijzen, praktische info en foto's. Van een week Europa tot drie weken Azië.",
  alternates: {
    canonical: "/reizen",
  },
};

const durations = [
  { value: "alles", label: "Alle duur" },
  { value: "kort", label: "1–7 dagen" },
  { value: "middel", label: "8–14 dagen" },
  { value: "lang", label: "15+ dagen" },
];

interface RoutesPageProps {
  searchParams: {
    regio?: string;
    duur?: string;
    pagina?: string;
  };
}

function buildUrl(params: { regio?: string; duur?: string; pagina?: number }) {
  const query = new URLSearchParams();

  if (params.regio && params.regio !== "alles") query.set("regio", params.regio);
  if (params.duur && params.duur !== "alles") query.set("duur", params.duur);
  if (params.pagina && params.pagina > 1) query.set("pagina", String(params.pagina));

  const suffix = query.toString();

  return suffix ? `/reizen?${suffix}` : "/reizen";
}

export default function RoutesPage({ searchParams }: RoutesPageProps) {
  const allRoutes = getAllRoutes();
  const hero = allRoutes[0];
  const heroStop = hero?.stops[1] ?? hero?.stops[0];
  const activeRegion =
    regions.find((region) => region.slug === searchParams.regio)?.slug ?? "alles";
  const activeDuration = durations.some((item) => item.value === searchParams.duur)
    ? searchParams.duur!
    : "alles";
  const page = Number(searchParams.pagina ?? 1) || 1;

  const filtered = allRoutes.filter((route) => {
    const regionMatch = activeRegion === "alles" || route.continent === activeRegion;
    const durationMatch =
      activeDuration === "alles" ||
      (activeDuration === "kort" && route.durationDays <= 7) ||
      (activeDuration === "middel" &&
        route.durationDays >= 8 &&
        route.durationDays <= 14) ||
      (activeDuration === "lang" && route.durationDays >= 15);

    return regionMatch && durationMatch;
  });

  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const routes = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (number) =>
        number === 1 ||
        number === totalPages ||
        Math.abs(number - currentPage) <= 1,
    )
    .slice(0, 7);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24">
        <div
          className="pointer-events-none absolute -right-20 top-0 h-[30rem] w-[30rem] rounded-full border border-jungle-900/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-sunset-100/60 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-wide relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow">Reisroutes</p>
              <h1 className="mt-5 max-w-2xl font-display text-[2.8rem] font-semibold leading-[0.99] tracking-[-0.045em] text-jungle-950 sm:text-[4.1rem]">
                Complete routes, van{" "}
                <span className="italic text-sunset-600">week tot weken.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.01rem] leading-8 text-jungle-800/80">
                Elke route heeft vaste stops, activiteiten met een prijs, een
                paklijst en praktische informatie. Kies een werelddeel en de
                duur die bij je past.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="tag">
                  <Clock className="h-3.5 w-3.5 text-sunset-600" />
                  {allRoutes.length} routes
                </span>
                <span className="tag">
                  <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                  {regions.length} werelddelen
                </span>
                <span className="tag">
                  <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                  Prijs per activiteit
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
              <div className="relative ml-auto aspect-[4/3] w-[86%] overflow-hidden rounded-[2.2rem] border-[5px] border-sand-50 bg-sand-200 shadow-card">
                <Image
                  src={hero?.coverImage ?? "/images/regio/europa.jpg"}
                  alt={hero?.coverAlt ?? "Reisroute"}
                  fill
                  priority
                  sizes="(min-width: 1024px) 36vw, 80vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-sand-50/95 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-jungle-900 backdrop-blur">
                  {hero ? `${hero.country} · ${hero.durationDays} dagen` : "Reisroutes"}
                </span>
              </div>
              <div className="absolute -bottom-7 left-0 w-[48%] -rotate-6 overflow-hidden rounded-2xl border-4 border-sand-50 bg-sand-50 shadow-sticker">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={heroStop?.image ?? "/images/regio/europa.jpg"}
                    alt={heroStop?.imageAlt ?? "Stop uit de route"}
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>
                <p className="px-2 pb-1 pt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-jungle-700">
                  {heroStop ? `${heroStop.name} · ${heroStop.dayLabel}` : "Stop 2"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-wide">
          <div className="rounded-[1.5rem] border border-jungle-900/10 bg-sand-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                Werelddeel
              </span>
              <Link
                href={buildUrl({ duur: activeDuration })}
                aria-current={activeRegion === "alles" ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeRegion === "alles"
                    ? "bg-jungle-900 text-sand-50"
                    : "bg-sand-100 text-jungle-800 hover:bg-sand-200"
                }`}
              >
                Alles
              </Link>
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={buildUrl({ regio: region.slug, duur: activeDuration })}
                  aria-current={
                    activeRegion === region.slug ? "page" : undefined
                  }
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeRegion === region.slug
                      ? "bg-jungle-900 text-sand-50"
                      : "bg-sand-100 text-jungle-800 hover:bg-sand-200"
                  }`}
                >
                  {region.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-jungle-900/10 pt-3">
              <span className="mr-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                Duur
              </span>
              {durations.map((duration) => (
                <Link
                  key={duration.value}
                  href={buildUrl({
                    regio: activeRegion,
                    duur: duration.value,
                  })}
                  aria-current={
                    activeDuration === duration.value ? "page" : undefined
                  }
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeDuration === duration.value
                      ? "bg-jungle-900 text-sand-50"
                      : "bg-sand-100 text-jungle-800 hover:bg-sand-200"
                  }`}
                >
                  {duration.label}
                </Link>
              ))}
              <span className="ml-auto text-xs font-medium text-jungle-600">
                {filtered.length} {filtered.length === 1 ? "route" : "routes"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-wide">
          {routes.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-jungle-900/20 bg-sand-100/60 px-6 py-16 text-center">
              <p className="font-display text-2xl font-semibold text-jungle-950">
                Nog geen route met deze filters.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-jungle-700/80">
                Kies een ander werelddeel of een andere duur.
              </p>
              <Link
                href="/reizen"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-jungle-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-jungle-800"
              >
                Toon alle routes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route, index) => (
                <Reveal key={route.slug} delay={(index % 3) * 70} className="h-full">
                  <RouteCard route={route} />
                </Reveal>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label="Paginering"
            >
              <Link
                href={buildUrl({
                  regio: activeRegion,
                  duur: activeDuration,
                  pagina: currentPage - 1,
                })}
                aria-disabled={currentPage === 1}
                className={`inline-flex items-center gap-1.5 rounded-full border border-jungle-900/15 px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "text-jungle-900 hover:bg-sand-100"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Vorige
              </Link>

              {pageNumbers.map((number, index) => {
                const previous = pageNumbers[index - 1];
                const gap = previous && number - previous > 1;

                return (
                  <span key={number} className="flex items-center gap-2">
                    {gap ? <span className="px-1 text-jungle-500">…</span> : null}
                    <Link
                      href={buildUrl({
                        regio: activeRegion,
                        duur: activeDuration,
                        pagina: number,
                      })}
                      aria-current={number === currentPage ? "page" : undefined}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors ${
                        number === currentPage
                          ? "bg-jungle-900 text-sand-50"
                          : "text-jungle-800 hover:bg-sand-100"
                      }`}
                    >
                      {number}
                    </Link>
                  </span>
                );
              })}

              <Link
                href={buildUrl({
                  regio: activeRegion,
                  duur: activeDuration,
                  pagina: currentPage + 1,
                })}
                aria-disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-1.5 rounded-full border border-jungle-900/15 px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "text-jungle-900 hover:bg-sand-100"
                }`}
              >
                Volgende
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          ) : null}
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <Reveal>
            <div className="grid gap-5 rounded-[2rem] border border-jungle-900/10 bg-sand-100/60 p-6 sm:p-8 md:grid-cols-3">
              <div>
                <p className="font-display text-4xl font-semibold text-jungle-950">
                  01
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-jungle-950">
                  Vaste stops.
                </h2>
                <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                  Van start tot eindpunt, met per stop een dagindeling en het
                  aantal nachten.
                </p>
              </div>
              <div className="border-jungle-900/10 md:border-l md:pl-6">
                <p className="font-display text-4xl font-semibold text-jungle-950">
                  02
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-jungle-950">
                  Prijs per activiteit.
                </h2>
                <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                  Wat een wandeling, boottocht of kookles ongeveer kost, in
                  bandbreedtes.
                </p>
              </div>
              <div className="border-jungle-900/10 md:border-l md:pl-6">
                <p className="font-display text-4xl font-semibold text-jungle-950">
                  03
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-jungle-950">
                  Praktisch compleet.
                </h2>
                <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                  Vervoer, verblijf, budget, beste reistijd en een paklijst die
                  je meteen kunt gebruiken.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-jungle-900 p-7 text-sand-100 sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                  Per werelddeel
                </p>
                <h2 className="mt-3 max-w-xl font-display text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.03em] text-sand-50 sm:text-[2rem]">
                  Liever per regio kijken?
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-7 text-sand-200/75">
                  Elke regio heeft een eigen overzicht met alle routes en tips.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                {regions.slice(0, 4).map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regio/${region.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand-100/25 px-3.5 py-2 text-sm font-medium text-sand-100 transition-colors hover:bg-sand-100/10"
                  >
                    {region.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
