"use client";

import L from "leaflet";
import Image from "next/image";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";

import { Clock, MapPin } from "@/components/icons";
import type { RouteStop } from "@/lib/types";

function createStopIcon(number: number) {
  return L.divIcon({
    className: "tm-stop-marker-wrap",
    html: `<div class="tm-stop-marker"><span>${number}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

function FitRoute({ stops }: { stops: RouteStop[] }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(stops.map((stop) => stop.coords));

    const fit = () => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [46, 46], maxZoom: 9 });
    };

    fit();
    const timer = window.setTimeout(fit, 350);

    return () => window.clearTimeout(timer);
  }, [map, stops]);

  return null;
}

interface RouteMapProps {
  stops: RouteStop[];
}

export default function RouteMap({ stops }: RouteMapProps) {
  const bounds = L.latLngBounds(stops.map((stop) => stop.coords));
  const positions = stops.map((stop) => stop.coords);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [46, 46] }}
      scrollWheelZoom={false}
      zoomControl={false}
      className="tm-map h-full w-full"
      aria-label="Kaart met de route en alle stops"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline
        positions={positions}
        pathOptions={{
          color: "#FBF6EC",
          weight: 8,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#E86F3C",
          weight: 3,
          opacity: 0.95,
          dashArray: "1 10",
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {stops.map((stop) => (
        <Marker
          key={stop.id}
          position={stop.coords}
          icon={createStopIcon(stop.number)}
          title={`Stop ${stop.number}: ${stop.name}`}
        >
          <Popup closeButton={false} maxWidth={280} minWidth={240}>
            <a
              href={`#stop-${stop.id}`}
              className="group block w-[248px] focus-visible:outline-none"
            >
              <div className="relative h-[120px] w-full overflow-hidden rounded-xl bg-sand-200">
                <Image
                  src={stop.image}
                  alt={stop.imageAlt}
                  fill
                  sizes="248px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sunset-500 text-xs font-bold text-white shadow">
                  {stop.number}
                </span>
              </div>
              <div className="px-0.5 pb-0.5 pt-3">
                <p className="inline-flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sunset-700">
                  <MapPin className="h-3 w-3" />
                  {stop.area}
                </p>
                <p className="mt-1 font-display text-lg font-semibold leading-tight text-jungle-950">
                  {stop.name}
                </p>
                <p className="mt-1.5 flex items-center gap-3 text-[0.7rem] font-medium text-jungle-600">
                  <span>{stop.dayLabel}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {stop.nights}{" "}
                    {stop.nights === 1 ? "nacht" : "nachten"}
                  </span>
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-jungle-900">
                  Spring naar de dag
                  <span aria-hidden="true">↓</span>
                </span>
              </div>
            </a>
          </Popup>
        </Marker>
      ))}

      <FitRoute stops={stops} />
      <ZoomControl position="bottomleft" />
    </MapContainer>
  );
}
