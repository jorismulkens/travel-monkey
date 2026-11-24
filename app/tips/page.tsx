import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  MapPin,
  Sparkles,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getAllRoutes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tips",
  description:
    "Praktische reistips uit onze routes: vervoer, budget, geld, internet, paklijst en tips per plek.",
  alternates: {
    canonical: "/tips",
  },
};

export default function TipsPage() {
  const route = getAllRoutes()[0];

  if (!route) {
    return null;
  }

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
          aria-hidden="true"
        >
          <div className="absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-sunset-100/70 blur-3xl" />
          <div className="absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full border border-jungle-900/10" />
        </div>

        <div className="container-wide relative">
          <div className="max-w-3xl">
            <p className="eyebrow">Tips</p>
            <h1 className="mt-5 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.045em] text-jungle-950 sm:text-[4.2rem]">
              Tips die we zelf{" "}
              <span className="italic text-sunset-600">uitprobeerden.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.05rem] leading-8 text-jungle-800/85">
              Geen lijstjes van tien die je overal al leest. Dit zijn de dingen
              die we onderweg leerden, vaak omdat we het de eerste keer verkeerd
              deden.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="tag">
                <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                Uit eigen ervaring
              </span>
              <span className="tag">
                <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                {route.stops.length} plekken
              </span>
              <span className="tag">
                <Compass className="h-3.5 w-3.5 text-sunset-600" />
                {route.country}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Praktisch"
            title={
              <>
                Voordat je gaat,{" "}
                <span className="italic text-sunset-600">dit even weten.</span>
              </>
            }
            description="De dingen die we achteraf graag van tevoren hadden geweten. Prijzen zijn wat we zelf betaalden."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {route.practical.map((item, index) => (
              <Reveal key={item.label} delay={index * 70} className="h-full">
                <div className="flex h-full flex-col rounded-[1.75rem] border border-jungle-900/10 bg-sand-50 p-6 sm:p-7">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-jungle-800/90">
                    {item.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand-100/70 py-20 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="eyebrow">Paklijst</p>
              <h2 className="mt-4 max-w-md font-display text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.035em] text-jungle-950 sm:text-[2.9rem]">
                Wat er in de{" "}
                <span className="italic text-sunset-600">rugzak ging.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-jungle-700/80">
                Geen complete paklijst, maar de dingen waar we blij mee waren —
                en die we de volgende keer weer mee zouden nemen.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {route.packing.map((item, index) => (
                <li key={item} className="h-full">
                  <Reveal delay={index * 50} className="h-full">
                    <div className="flex h-full items-start gap-3 rounded-2xl border border-jungle-900/10 bg-sand-50 p-4 text-sm leading-6 text-jungle-800/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jungle-900 text-sand-50">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Per plek"
            title={
              <>
                Kleine dingen die we{" "}
                <span className="italic text-sunset-600">daar leerden.</span>
              </>
            }
            description="Per stop één tip die we zelf hadden willen weten. Soms praktisch, soms gewoon eerlijk."
            action={{ href: `/reizen/${route.slug}`, label: "Bekijk de hele route" }}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {route.stops.map((stop, index) => (
              <Reveal key={stop.id} delay={index * 60} className="h-full">
                <div className="flex h-full flex-col rounded-[1.75rem] border border-jungle-900/10 bg-sand-50 p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                      <MapPin className="h-3.5 w-3.5" />
                      {stop.name}
                    </p>
                    <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-jungle-500">
                      {stop.area}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-jungle-700/85">
                    {stop.tip}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-jungle-900 p-7 text-sand-100 sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                  De hele route
                </p>
                <h2 className="mt-3 max-w-xl font-display text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.03em] text-sand-50 sm:text-[2rem]">
                  Alle tips bij elkaar in één route.
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-7 text-sand-200/75">
                  {route.durationLabel} {route.country}, met alle stops,
                  prijzen en tips bij elkaar.
                </p>
              </div>
              <Link
                href={`/reizen/${route.slug}`}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-sand-50 px-5 py-3.5 text-sm font-semibold text-jungle-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sunset-500 hover:text-white"
              >
                Bekijk de route
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
