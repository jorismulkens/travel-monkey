"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowUpRight,
  Compass,
  Sparkles,
} from "@/components/icons";
import { MonkeyMark } from "@/components/monkey-mark";
import { RouteCard } from "@/components/route-card";
import type { Route } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterValue = "alles" | "kort" | "middel" | "lang";

const filters: Array<{ value: FilterValue; label: string }> = [
  { value: "alles", label: "Alle routes" },
  { value: "kort", label: "1–7 dagen" },
  { value: "middel", label: "8–14 dagen" },
  { value: "lang", label: "15+ dagen" },
];

function matchesFilter(route: Route, filter: FilterValue) {
  if (filter === "alles") {
    return true;
  }

  if (filter === "kort") {
    return route.durationDays <= 7;
  }

  if (filter === "middel") {
    return route.durationDays >= 8 && route.durationDays <= 14;
  }

  return route.durationDays >= 15;
}

interface RouteFiltersProps {
  routes: Route[];
}

export function RouteFilters({ routes }: RouteFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("alles");

  const filteredRoutes = useMemo(
    () => routes.filter((route) => matchesFilter(route, activeFilter)),
    [activeFilter, routes],
  );

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-jungle-900/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0"
          role="group"
          aria-label="Filter reisroutes op duur"
        >
          {filters.map((filter) => {
            const count = routes.filter((route) =>
              matchesFilter(route, filter.value),
            ).length;
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 focus-visible:ring-offset-2 focus-visible:ring-offset-shell",
                  isActive
                    ? "border-jungle-900 bg-jungle-900 text-sand-50 shadow-soft"
                    : "border-jungle-900/15 bg-sand-50 text-jungle-800 hover:border-jungle-900/35 hover:bg-sand-100",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
                    isActive
                      ? "bg-sand-50/15 text-sand-100"
                      : "bg-jungle-900/10 text-jungle-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="inline-flex items-center gap-2 text-sm text-jungle-600">
          <Compass className="h-4 w-4 text-sunset-600" />
          {filteredRoutes.length}{" "}
          {filteredRoutes.length === 1 ? "route" : "routes"} gevonden
        </p>
      </div>

      {filteredRoutes.length > 0 ? (
        <div
          className={cn(
            "mt-10 grid gap-7",
            filteredRoutes.length > 1
              ? "md:grid-cols-2"
              : "lg:grid-cols-[1.32fr_0.68fr]",
          )}
        >
          {filteredRoutes.map((route) => (
            <RouteCard
              key={`${activeFilter}-${route.slug}`}
              route={route}
              className="animate-fade-up"
            />
          ))}

          {filteredRoutes.length === 1 ? (
            <aside className="relative flex flex-col overflow-hidden rounded-[2rem] bg-jungle-900 p-7 text-sand-100 shadow-soft sm:p-9">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-sand-100/10"
                aria-hidden="true"
              />
              <div className="relative">
                <MonkeyMark size={52} />
                <p className="mt-7 text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                  Mijn regel
                </p>
                <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-sand-50">
                  Eerst lopen, dan schrijven.
                </h2>
                <p className="mt-5 text-sm leading-7 text-sand-200/75">
                  Ik zet pas een route online als ik hem zelf heb gelopen. Met
                  de prijzen die ik betaalde, de boot die te laat kwam en de
                  plek waar ik langer bleef dan gepland.
                </p>
                <p className="mt-4 text-sm leading-7 text-sand-200/75">
                  Daarom staat hier nu één route. De volgende komt pas als ik
                  terug ben — niet omdat de kalender het vraagt.
                </p>

                <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-sand-100/15 py-5 text-center">
                  <div>
                    <dt className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-sand-300/65">
                      Route
                    </dt>
                    <dd className="mt-1 font-display text-xl font-semibold text-sand-50">
                      1
                    </dd>
                  </div>
                  <div className="border-x border-sand-100/15">
                    <dt className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-sand-300/65">
                      Stops
                    </dt>
                    <dd className="mt-1 font-display text-xl font-semibold text-sand-50">
                      8
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-sand-300/65">
                      Dagen
                    </dt>
                    <dd className="mt-1 font-display text-xl font-semibold text-sand-50">
                      21
                    </dd>
                  </div>
                </dl>
              </div>

              <Link
                href="/over"
                className="group relative mt-7 inline-flex items-center justify-between gap-3 rounded-full border border-sand-100/20 px-5 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-sand-50 hover:text-jungle-950"
              >
                Waarom ik dit doe
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </aside>
          ) : null}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] border border-dashed border-jungle-900/20 bg-sand-100/60 px-6 py-16 text-center">
          <MonkeyMark size={56} className="mx-auto" />
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] text-jungle-950">
            Deze route is nog niet af.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-jungle-700/80">
            Ik zet pas een route online als ik hem zelf heb gelopen. Kies een
            andere duur of bekijk de route die er wel is.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("alles")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-jungle-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-jungle-800"
          >
            <Sparkles className="h-4 w-4" />
            Toon alle routes
          </button>
        </div>
      )}
    </div>
  );
}
