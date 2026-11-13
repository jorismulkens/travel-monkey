"use client";

import dynamic from "next/dynamic";

import type { Coordinates } from "@/lib/types";

const MiniMap = dynamic(() => import("@/components/mini-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sand-200">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-jungle-900/20 border-t-jungle-900" />
    </div>
  ),
});

interface MiniMapWrapperProps {
  name: string;
  country: string;
  coords: Coordinates;
  zoom?: number;
}

export function MiniMapWrapper(props: MiniMapWrapperProps) {
  return <MiniMap {...props} />;
}
