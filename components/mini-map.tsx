"use client";

import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";

import { MapPin } from "@/components/icons";
import type { Coordinates } from "@/lib/types";

const miniMarker = L.divIcon({
  className: "tm-marker",
  html: `<div class="tm-marker__pin tm-marker__pin--blog tm-marker__pin--pulse"><span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg></span></div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 42],
  popupAnchor: [0, -38],
});

interface MiniMapProps {
  name: string;
  country: string;
  coords: Coordinates;
  zoom?: number;
}

export default function MiniMap({
  name,
  country,
  coords,
  zoom = 11,
}: MiniMapProps) {
  return (
    <MapContainer
      center={coords}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl={false}
      className="tm-map h-full w-full"
      aria-label={`Kaart met de locatie ${name}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords} icon={miniMarker} title={name}>
        <Popup closeButton={false} maxWidth={220}>
          <div className="w-[190px] p-0.5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sunset-700">
              {country}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-jungle-950">
              {name}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-jungle-600">
              <MapPin className="h-3.5 w-3.5 text-sunset-600" />
              {name}, {country}
            </p>
          </div>
        </Popup>
      </Marker>
      <ZoomControl position="bottomleft" />
    </MapContainer>
  );
}
