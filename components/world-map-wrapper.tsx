"use client";

import dynamic from "next/dynamic";

import type { LocationPin } from "@/lib/types";

const WorldMap = dynamic(() => import("@/components/world-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sand-200">
      <div className="text-center">
        <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-jungle-900/20 border-t-jungle-900" />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-jungle-700">
          Kaart wordt geladen
        </p>
      </div>
    </div>
  ),
});

interface WorldMapWrapperProps {
  locations: LocationPin[];
}

export function WorldMapWrapper({ locations }: WorldMapWrapperProps) {
  return <WorldMap locations={locations} />;
}
