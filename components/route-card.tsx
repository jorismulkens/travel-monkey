import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, Clock, MapPin } from "@/components/icons";
import type { Route } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  route: Route;
  featured?: boolean;
  className?: string;
}

export function RouteCard({ route, featured, className }: RouteCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-jungle-900/10 bg-sand-50 p-2.5 shadow-[0_16px_45px_-34px_rgba(27,42,35,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-jungle-900/20 hover:shadow-card",
        className,
      )}
    >
      <Link
        href={`/reizen/${route.slug}`}
        className="flex h-full flex-col rounded-[1.55rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 focus-visible:ring-offset-4 focus-visible:ring-offset-sand-50"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.55rem] bg-sand-200",
            featured ? "aspect-[16/10]" : "aspect-[4/3]",
          )}
        >
          <Image
            src={route.coverImage}
            alt={route.coverAlt}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 58vw, 100vw"
                : "(min-width: 768px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-jungle-950/65 via-jungle-950/5 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-50/95 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-jungle-900 backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-sunset-600" />
              {route.country}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jungle-950/80 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sand-50 backdrop-blur">
              <Clock className="h-3.5 w-3.5" />
              {route.durationLabel}
            </span>
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-sand-50/30 bg-jungle-950/25 px-3 py-1.5 text-[0.7rem] font-medium text-sand-50 backdrop-blur">
                {route.stops.length} stops
              </span>
              <span className="rounded-full border border-sand-50/30 bg-jungle-950/25 px-3 py-1.5 text-[0.7rem] font-medium text-sand-50 backdrop-blur">
                {route.travelStyle}
              </span>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-50 text-jungle-900 transition-all duration-300 group-hover:bg-sunset-500 group-hover:text-white">
              <ArrowUpRight className="h-[18px] w-[18px]" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 pt-5 sm:p-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
            {route.kicker}
          </p>
          <h3
            className={cn(
              "mt-2 font-display font-semibold leading-[1.1] tracking-[-0.03em] text-jungle-950",
              featured ? "text-2xl sm:text-[2rem]" : "text-[1.45rem]",
            )}
          >
            {route.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-jungle-700/80">
            {route.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="text-xs font-semibold text-jungle-600">
              {route.startPoint} → {route.endPoint}
            </span>
            <span className="text-sm font-semibold text-jungle-900 transition-colors group-hover:text-sunset-600">
              Bekijk route
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
