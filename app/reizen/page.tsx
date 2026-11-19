import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, Clock, MapPin, Sparkles } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { RouteFilters } from "@/components/route-filters";
import { getAllRoutes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reisroutes",
  description:
    "Reisroutes die we zelf liepen, met dag-tot-dag plannen, echte prijzen en praktische tips. Begin met drie weken Bali.",
  alternates: {
    canonical: "/reizen",
  },
};

export default function RoutesPage() {
  const routes = getAllRoutes();

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
                Routes met{" "}
                <span className="italic text-sunset-600">natte schoenen</span>{" "}
                en echte prijzen.
              </h1>
              <p className="mt-6 max-w-xl text-[1.01rem] leading-8 text-jungle-800/80">
                Geen route die we van internet plukten. Alles hier is zelf
                gelopen, geboekt en betaald. Soms ging het mis, en dat staat er
                dan ook bij.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="tag">
                  <Clock className="h-3.5 w-3.5 text-sunset-600" />
                  {routes.length} geteste route
                </span>
                <span className="tag">
                  <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                  8 stops
                </span>
                <span className="tag">
                  <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                  Geen sponsoring
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
              <div className="relative ml-auto aspect-[4/3] w-[86%] overflow-hidden rounded-[2.2rem] border-[5px] border-sand-50 bg-sand-200 shadow-card">
                <Image
                  src="/images/nusa-aerial.jpg"
                  alt="Turquoise baai op Nusa Penida"
                  fill
                  priority
                  sizes="(min-width: 1024px) 36vw, 80vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-jungle-950/40 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute inset-x-5 bottom-5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white">
                  Nusa Penida · stop 6
                </span>
              </div>
              <div className="absolute -bottom-6 left-0 w-[45%] -rotate-6 overflow-hidden rounded-2xl border-4 border-sand-50 bg-sand-50 shadow-sticker">
                <div className="relative aspect-square">
                  <Image
                    src="/images/gili-sunset.jpg"
                    alt="Zonsondergang op Gili Trawangan"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <p className="px-2 pb-1 pt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-jungle-700">
                  Gili T. · stop 5
                </p>
              </div>
              <div className="absolute -right-2 top-5 rotate-6 rounded-full bg-sunset-500 px-4 py-3 text-center shadow-sticker">
                <p className="font-display text-lg font-semibold leading-none text-white">
                  21
                </p>
                <p className="mt-1 text-[0.52rem] font-bold uppercase tracking-[0.15em] text-sunset-100">
                  dagen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="container-wide">
          <div className="flex flex-col gap-4 border-t border-jungle-900/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Kies je tempo</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-jungle-950 sm:text-4xl">
                Hoe lang heb je?
              </h2>
            </div>
            <a
              href="/over-ons"
              className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-jungle-700 transition-colors hover:text-sunset-600"
            >
              Hoe wij routes maken
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-7">
            <RouteFilters routes={routes} />
          </div>

          <Reveal className="mt-16">
            <div className="grid gap-5 rounded-[2rem] border border-jungle-900/10 bg-sand-100/60 p-6 sm:p-8 md:grid-cols-3">
              <div>
                <p className="font-display text-4xl font-semibold text-jungle-950">
                  01
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-jungle-950">
                  Wij lopen hem eerst.
                </h3>
                <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                  Geen routes uit een brochure. Elke stop is ergens waar we zelf
                  sliepen, aten of verdwaalden.
                </p>
              </div>
              <div className="border-jungle-900/10 md:border-l md:pl-6">
                <p className="font-display text-4xl font-semibold text-jungle-950">
                  02
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-jungle-950">
                  Wij schrijven de prijs op.
                </h3>
                <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                  Wat we betaalden, niet wat een website zegt dat het kost.
                  Prijzen zijn momentopnames, dus check ze altijd opnieuw.
                </p>
              </div>
              <div className="border-jungle-900/10 md:border-l md:pl-6">
                <p className="font-display text-4xl font-semibold text-jungle-950">
                  03
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-jungle-950">
                  Wij laten fouten staan.
                </h3>
                <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                  De verkeerde boot, de te dure taxi, de koffer in het zand. Dat
                  is vaak het nuttigste deel van een route.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-jungle-900 p-7 text-sand-100 sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                  Liever eerst tips
                </p>
                <h2 className="mt-3 max-w-xl font-display text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.03em] text-sand-50 sm:text-[2rem]">
                  Voordat je gaat: dit hadden we graag geweten.
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-7 text-sand-200/75">
                  Over vervoer, geld, internet en wat er echt in je tas moet.
                  Alles wat we onderweg leerden, op één plek.
                </p>
              </div>
              <Link
                href="/tips"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-sand-50 px-5 py-3.5 text-sm font-semibold text-jungle-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sunset-500 hover:text-white"
              >
                Lees de tips
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
