import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ArrowUpRight, MapPin, Sparkles } from "@/components/icons";
import type { Route } from "@/lib/types";

interface HomeHeroProps {
  route: Route;
}

export function HomeHero({ route }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      <div
        className="pointer-events-none absolute -left-28 top-20 h-[30rem] w-[30rem] rounded-full bg-sunset-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-48 top-0 h-[36rem] w-[36rem] rounded-full border border-jungle-900/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(39,75,57,0.22) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 25%, black 72%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 25%, black 72%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div className="relative z-10">
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-jungle-900/15 bg-sand-50/70 px-4 py-2 text-[0.67rem] font-semibold uppercase tracking-[0.17em] text-jungle-700 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
              Reisblog · sinds 2022
            </p>

            <h1
              className="mt-7 animate-fade-up font-display text-[3.15rem] font-semibold leading-[0.98] tracking-[-0.045em] text-jungle-950 sm:text-[4.5rem] lg:text-[5.15rem]"
              style={{ animationDelay: "80ms" }}
            >
              Reis verder
              <br />
              dan de{" "}
              <span className="relative inline-block italic text-sunset-600">
                gebaande
                <svg
                  viewBox="0 0 250 14"
                  className="absolute -bottom-1 left-0 h-3 w-full text-sunset-300"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C55 4 182 3 247 8"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              paden.
            </h1>

            <p
              className="mt-7 max-w-xl animate-fade-up text-[1.02rem] leading-8 text-jungle-800/85 sm:text-[1.08rem]"
              style={{ animationDelay: "160ms" }}
            >
              Wij schrijven over reizen: routes die we zelf liepen, tips die
              echt werken en verhalen van onderweg. Met echte prijzen, natte
              schoenen en de verkeerde afslagen erbij.
            </p>

            <div
              className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/reizen"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-jungle-900 px-6 py-3.5 text-sm font-semibold text-sand-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-jungle-800 hover:shadow-soft"
              >
                Bekijk de routes
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/blog"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-jungle-900/20 bg-transparent px-6 py-3.5 text-sm font-semibold text-jungle-900 transition-all duration-300 hover:border-jungle-900/40 hover:bg-sand-50"
              >
                Lees de verhalen
                <ArrowUpRight className="h-4 w-4 text-sunset-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div
              className="mt-11 flex animate-fade-up flex-wrap gap-x-9 gap-y-5 border-t border-jungle-900/10 pt-6"
              style={{ animationDelay: "320ms" }}
            >
              <div>
                <p className="font-display text-[1.8rem] font-semibold leading-none text-jungle-950">
                  21
                </p>
                <p className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
                  dagen Bali
                </p>
              </div>
              <div>
                <p className="font-display text-[1.8rem] font-semibold leading-none text-jungle-950">
                  8
                </p>
                <p className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
                  plekken
                </p>
              </div>
              <div>
                <p className="font-display text-[1.8rem] font-semibold leading-none text-jungle-950">
                  €1.280
                </p>
                <p className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
                  echt uitgegeven
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-0 mx-auto w-full max-w-[34rem] animate-fade-up pt-8 lg:pt-0" style={{ animationDelay: "180ms" }}>
            <div
              className="absolute -left-5 top-1/3 hidden h-24 w-24 -rotate-12 items-center justify-center rounded-full border border-jungle-900/10 bg-sand-100/70 text-center sm:flex"
              aria-hidden="true"
            >
              <span className="text-[0.58rem] font-semibold uppercase leading-4 tracking-[0.16em] text-jungle-600">
                Bali
                <br />
                8°30′S
                <br />
                115°E
              </span>
            </div>

            <div className="absolute -top-1 right-8 z-20 rotate-6 rounded-full border border-white/70 bg-sunset-500 px-5 py-3 text-center shadow-sticker">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white">
                Route getest
              </p>
              <p className="font-display text-sm font-semibold italic text-white">
                in 2025
              </p>
            </div>

            <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-[2.7rem] border-[5px] border-sand-50 bg-sand-200 shadow-card sm:w-[82%]">
              <Image
                src="/images/nusa-aerial.jpg"
                alt="Turquoise baai met kliffen op Nusa Penida"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-jungle-950/55 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-5 right-5 max-w-[54%] text-right">
                <p className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sand-200">
                  <MapPin className="h-3 w-3" />
                  Nusa Penida
                </p>
                <p className="mt-1 font-display text-xl font-medium italic leading-tight text-white">
                  Het water is echt zo blauw.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-7 left-0 z-20 w-[48%] -rotate-6 rounded-2xl bg-sand-50 p-2.5 shadow-sticker sm:-left-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-200">
                <Image
                  src="/images/ubud-green.jpg"
                  alt="Rijstterrassen bij Ubud in de ochtend"
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <p className="flex items-center justify-between px-1 pb-0.5 pt-2.5 text-[0.64rem] font-semibold text-jungle-800">
                <span>Ubud, 06.20</span>
                <span className="text-sunset-600">foto</span>
              </p>
            </div>

            <div className="absolute -right-2 top-[47%] z-10 hidden h-28 w-28 rotate-6 items-center justify-center rounded-full bg-sunset-500 text-center text-white shadow-sticker sm:flex">
              <div>
                <p className="font-display text-2xl font-semibold leading-none">
                  8
                </p>
                <p className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.15em]">
                  stops
                </p>
                <p className="mt-0.5 text-[0.56rem] font-medium italic text-sunset-100">
                  1 rugzak
                </p>
              </div>
            </div>

            <div
              className="absolute -bottom-4 right-4 hidden h-16 w-16 rotate-12 items-center justify-center rounded-2xl border border-jungle-900/10 bg-sand-50 shadow-sticker md:flex"
              aria-hidden="true"
            >
              <span className="animate-wag text-2xl">🐒</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-jungle-600">
          <span className="flex h-9 w-5 items-center justify-center rounded-full border border-jungle-900/20">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sunset-500" />
          </span>
          Scroll voor de route
        </div>
      </div>
    </section>
  );
}
