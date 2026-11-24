import Image from "next/image";
import Link from "next/link";

import { HomeHero } from "@/components/home-hero";
import { ArrowRight, ArrowUpRight, MapPin } from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { MonkeyMark } from "@/components/monkey-mark";
import { Reveal } from "@/components/reveal";
import { RouteCard } from "@/components/route-card";
import { SectionHeading } from "@/components/section-heading";
import { WorldMapSection } from "@/components/world-map-section";
import { getAllRoutes, getLocations } from "@/lib/content";
import { regions } from "@/lib/regions";

export default function HomePage() {
  const routes = getAllRoutes();
  const locations = getLocations();
  const latest = routes[0];
  const featured = routes.slice(0, 3);

  if (!latest) {
    return null;
  }

  const tips = latest.stops.slice(0, 3);

  return (
    <>
      <HomeHero route={latest} routeCount={routes.length} />
      <Marquee />

      <section className="section-space">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Nieuwste routes"
            title={
              <>
                Vers van de{" "}
                <span className="italic text-sunset-600">redactie.</span>
              </>
            }
            description="Elke route heeft vaste stops, activiteiten met een prijs, een paklijst en praktische informatie. Kies een werelddeel en de duur die bij je past."
            action={{ href: "/reizen", label: "Alle reisroutes" }}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((route, index) => (
              <Reveal key={route.slug} delay={(index % 3) * 80} className="h-full">
                <RouteCard route={route} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-wide">
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-jungle-900/10 bg-sand-50 p-5 sm:flex-row sm:items-center sm:p-6">
            <p className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-700">
              Per regio
            </p>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/regio/${region.slug}`}
                  className="rounded-full bg-sand-100 px-3.5 py-1.5 text-sm font-medium text-jungle-800 transition-colors hover:bg-sand-200"
                >
                  {region.label}
                </Link>
              ))}
            </div>
            <Link
              href="/reizen"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-jungle-900 transition-colors hover:text-sunset-600 sm:ml-auto"
            >
              Alle routes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-sand-100/70">
        <WorldMapSection locations={locations} />
      </div>

      <section className="section-space">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Kleine tips"
            title={
              <>
                Dingen die je pas{" "}
                <span className="italic text-sunset-600">onderweg leert.</span>
              </>
            }
            description={`De tips uit ${latest.country}: wat je vooraf wilt weten en wat je beter ter plaatse regelt.`}
            action={{ href: "/tips", label: "Alle tips" }}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {tips.map((stop, index) => (
              <Reveal key={stop.id} delay={index * 90} className="h-full">
                <div className="flex h-full flex-col rounded-[1.75rem] border border-jungle-900/10 bg-sand-50 p-6">
                  <p className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                    <MapPin className="h-3.5 w-3.5" />
                    {stop.name}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-jungle-700/85">
                    {stop.tip}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-jungle-900 text-sand-100 sm:rounded-[2.75rem]">
              <div
                className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-sand-100/10"
                aria-hidden="true"
              />
              <div className="grid lg:grid-cols-[0.74fr_1.26fr]">
                <div className="relative min-h-[22rem] overflow-hidden lg:min-h-full">
                  <Image
                    src="/images/traveler-portrait.jpg"
                    alt="Mila, oprichter van Travel Monkey"
                    fill
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-jungle-950/70 via-transparent to-transparent lg:bg-gradient-to-r"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-5 left-5 rounded-full bg-sand-50/95 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-jungle-900 backdrop-blur">
                    Mila · oprichter
                  </div>
                </div>

                <div className="relative p-8 sm:p-12 lg:p-16">
                  <span
                    className="absolute right-8 top-8 animate-wag text-3xl sm:right-12 sm:top-12"
                    aria-hidden="true"
                  >
                    🐒
                  </span>
                  <p className="eyebrow text-sunset-300 before:bg-sunset-400">
                    Over ons
                  </p>
                  <blockquote className="mt-5 max-w-2xl font-display text-[1.85rem] font-medium leading-[1.2] tracking-[-0.025em] text-sand-50 sm:text-[2.35rem]">
                    &ldquo;Wij schrijven alleen over plekken waar we zelf
                    waren.&rdquo;
                  </blockquote>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-sand-200/75">
                    Travel Monkey begon als een notitieboek vol prijzen,
                    boottijden en fouten. Die notities zijn nu complete routes
                    met stops, kosten en tips. Geen perfecte plaatjes, wel
                    eerlijk reizen.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link
                      href="/over-ons"
                      className="group inline-flex items-center gap-2 rounded-full bg-sand-50 px-5 py-3 text-sm font-semibold text-jungle-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sunset-500 hover:text-white"
                    >
                      Over ons
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <span className="text-xs font-medium text-sand-300/70">
                      Utrecht · 14 maanden in Azië · nog steeds slechte
                      landkaarten
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-sunset-500 px-6 py-14 text-center text-white sm:rounded-[2.75rem] sm:px-12 sm:py-16">
              <div
                className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-white/15"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-28 -right-10 h-72 w-72 rounded-full border border-white/15"
                aria-hidden="true"
              />
              <MonkeyMark size={58} className="mx-auto ring-4 ring-white/20" />
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[3rem]">
                Kies je volgende reis.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-sunset-50/90 sm:text-base">
                Begin bij een werelddeel of bij de duur die je hebt. Elke route
                staat er gratis op, met prijzen en tips.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/reizen"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-jungle-950 px-6 py-3.5 text-sm font-semibold text-sand-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-jungle-900"
                >
                  Bekijk alle routes
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/tips"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Lees de tips
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
