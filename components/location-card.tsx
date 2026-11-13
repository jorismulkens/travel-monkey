import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, MapPin } from "@/components/icons";
import type { LocationPin } from "@/lib/types";

interface LocationCardProps {
  location: LocationPin;
  index?: number;
}

export function LocationCard({ location, index }: LocationCardProps) {
  const href =
    location.type === "route"
      ? `/reizen/${location.slug}`
      : `/blog/${location.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-jungle-900/10 bg-sand-50 p-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-sand-200">
        <Image
          src={location.thumbnail}
          alt={`${location.name}, ${location.country}`}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {typeof index === "number" ? (
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-sand-50/90 text-xs font-bold text-jungle-900 backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sunset-700">
          <MapPin className="h-3 w-3" />
          {location.country} ·{" "}
          {location.type === "route" ? "reisroute" : "verhaal"}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em] text-jungle-950">
          {location.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-jungle-700/75">
          {location.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-jungle-900 transition-colors group-hover:text-sunset-600">
          Bekijken
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
