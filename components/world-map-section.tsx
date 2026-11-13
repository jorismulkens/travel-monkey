"use client";

import Link from "next/link";

import { ArrowUpRight, Compass, MapPin } from "@/components/icons";
import { WorldMapWrapper } from "@/components/world-map-wrapper";
import type { LocationPin } from "@/lib/types";

interface WorldMapSectionProps {
  locations: LocationPin[];
}

export function WorldMapSection({ locations }: WorldMapSectionProps) {
  return (
    <section className="section-space" aria-labelledby="kaart-titel">
      <div className="container-wide">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="eyebrow">Waar ik was</p>
            <h2
              id="kaart-titel"
              className="mt-4 max-w-md font-display text-[2.15rem] font-semibold leading-[1.06] tracking-[-0.04em] text-jungle-950 sm:text-5xl"
            >
              Eén kaart, een hoop
              <span className="relative ml-2 inline-block text-sunset-600">
                omwegen
                <svg
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-sunset-300"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8.5C47 3 150 2 198 7"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[0.98rem] leading-7 text-jungle-700/80">
              Klik op een cluster of pin om te zien waar ik was en wat ik er
              deed. Zoom in voor de losse plekken. Alles op deze kaart heb ik
              zelf bezocht.
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold text-jungle-700">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-sand-50 bg-jungle-800 shadow" />
                Reisroute
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-sand-50 bg-sunset-500 shadow" />
                Verhaal
              </span>
              <span className="inline-flex items-center gap-2 text-jungle-500">
                <Compass className="h-3.5 w-3.5" />
                {locations.length} plekken
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border-[6px] border-sand-50 bg-sand-50 shadow-card sm:rounded-[2.5rem] sm:border-8">
            <div className="flex items-center justify-between gap-4 border-b border-jungle-900/10 px-4 py-3.5 sm:px-6 sm:py-4">
              <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-jungle-800">
                <MapPin className="h-4 w-4 text-sunset-600" />
                De kaart van Travel Monkey
              </span>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-jungle-900 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-sand-50">
                {locations.length} plekken
              </span>
            </div>
            <div className="h-[32rem] bg-sand-200 sm:h-[34rem] lg:h-[37rem]">
              <WorldMapWrapper locations={locations} />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={
                location.type === "route"
                  ? `/reizen/${location.slug}`
                  : `/blog/${location.slug}`
              }
              className="group flex items-center justify-between gap-4 rounded-2xl border border-jungle-900/10 bg-sand-50/65 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-jungle-900/25 hover:bg-sand-50 hover:shadow-soft"
            >
              <span>
                <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                  {location.type === "route" ? "Reisroute" : "Verhaal"}
                </span>
                <span className="mt-1 block font-display text-lg font-semibold text-jungle-950">
                  {location.name}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-jungle-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sunset-600" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
