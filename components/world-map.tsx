"use client";

import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { ArrowUpRight, MapPin } from "@/components/icons";
import type { Coordinates, LocationPin } from "@/lib/types";

function createMarkerIcon(type: LocationPin["type"]) {
  const isRoute = type === "route";
  const icon = isRoute
    ? `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true"><path d="M12 2.7 14.4 9l6.3 2.4-6.3 2.4L12 20.1l-2.4-6.3L3.3 11.4 9.6 9 12 2.7Z" fill="currentColor"/></svg>`
    : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="m15.2 4.8 4 4L8.5 19.5l-5 .9.9-5L15.2 4.8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;

  return L.divIcon({
    className: "tm-marker",
    html: `<div class="tm-marker__pin tm-marker__pin--${type}"><span>${icon}</span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 42],
    popupAnchor: [0, -38],
  });
}

function createClusterIcon(count: number) {
  return L.divIcon({
    className: "tm-cluster-wrap",
    html: `<div class="tm-cluster-marker"><strong>${count}</strong><small>plekken</small></div>`,
    iconSize: [68, 68],
    iconAnchor: [34, 34],
    popupAnchor: [0, -32],
  });
}

const routeIcon = createMarkerIcon("route");
const blogIcon = createMarkerIcon("blog");

interface LocationGroup {
  key: string;
  country: string;
  locations: LocationPin[];
  center: Coordinates;
}

function groupLocations(locations: LocationPin[]): LocationGroup[] {
  const groups = new Map<string, LocationPin[]>();

  locations.forEach((location) => {
    const key = location.country;
    const current = groups.get(key) ?? [];
    groups.set(key, [...current, location]);
  });

  return [...groups.entries()].map(([country, items]) => {
    const center: Coordinates = [
      items.reduce((sum, item) => sum + item.coords[0], 0) / items.length,
      items.reduce((sum, item) => sum + item.coords[1], 0) / items.length,
    ];

    return {
      key: country,
      country,
      locations: items,
      center,
    };
  });
}

function ZoomWatcher({ onChange }: { onChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend() {
      onChange(map.getZoom());
    },
  });

  useEffect(() => {
    onChange(map.getZoom());
  }, [map, onChange]);

  return null;
}

function LocationPopup({ location }: { location: LocationPin }) {
  return (
    <Popup closeButton={false} maxWidth={260} minWidth={230}>
      <Link
        href={
          location.type === "route"
            ? `/reizen/${location.slug}`
            : `/blog/${location.slug}`
        }
        className="group block w-[228px] focus-visible:outline-none"
      >
        <div className="relative h-[118px] w-full overflow-hidden rounded-xl bg-sand-200">
          <Image
            src={location.thumbnail}
            alt={`${location.name}, ${location.country}`}
            fill
            sizes="228px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-shell/95 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-jungle-900">
            <MapPin className="h-3 w-3 text-sunset-600" />
            {location.type === "route" ? "Reisroute" : "Verhaal"}
          </span>
        </div>
        <div className="px-0.5 pb-0.5 pt-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
            {location.country}
          </p>
          <p className="mt-1 font-display text-lg font-semibold leading-tight text-jungle-950">
            {location.name}
          </p>
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-jungle-700">
            {location.excerpt}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-jungle-900">
            Bekijk op de site
            <ArrowUpRight className="h-3.5 w-3.5 text-sunset-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </Popup>
  );
}

function CountryCluster({ group }: { group: LocationGroup }) {
  const map = useMap();
  const bounds = L.latLngBounds(
    group.locations.map((location) => location.coords),
  );

  return (
    <Marker
      position={group.center}
      icon={createClusterIcon(group.locations.length)}
      title={`${group.locations.length} plekken in ${group.country}`}
    >
      <Popup closeButton={false} maxWidth={280}>
        <div className="w-[250px] p-1">
          <p className="font-display text-lg font-semibold leading-tight text-jungle-950">
            {group.locations.length} plekken in {group.country}
          </p>
          <p className="mt-0.5 text-[0.65rem] leading-4 text-jungle-600">
            Dicht bij elkaar. Kies een plek of zoom in.
          </p>

          <div className="mt-2 divide-y divide-jungle-900/10 border-y border-jungle-900/10">
            {group.locations.map((location) => (
              <Link
                key={location.id}
                href={
                  location.type === "route"
                    ? `/reizen/${location.slug}`
                    : `/blog/${location.slug}`
                }
                className="group flex items-center gap-2.5 py-2"
              >
                <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-sand-200">
                  <Image
                    src={location.thumbnail}
                    alt={location.name}
                    fill
                    sizes="48px"
                    loading="eager"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.5rem] font-semibold uppercase tracking-[0.13em] text-sunset-700">
                    {location.type === "route" ? "Reisroute" : "Verhaal"}
                  </p>
                  <p className="truncate font-display text-sm font-semibold leading-tight text-jungle-950">
                    {location.name}
                  </p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-jungle-500 transition-colors group-hover:text-sunset-600" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              map.flyToBounds(bounds, {
                padding: [70, 70],
                maxZoom: 9,
                duration: 1.1,
              })
            }
            className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-jungle-900 px-4 py-2 text-[0.68rem] font-semibold text-sand-50 transition-colors hover:bg-sunset-500"
          >
            Zoom in op de pins
            <span aria-hidden="true">↘</span>
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

interface WorldMapProps {
  locations: LocationPin[];
}

export default function WorldMap({ locations }: WorldMapProps) {
  const [zoom, setZoom] = useState(2);
  const groups = useMemo(() => groupLocations(locations), [locations]);
  const shouldCluster = zoom <= 5;

  return (
    <MapContainer
      center={[4, 106]}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      worldCopyJump
      className="tm-map h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomWatcher onChange={setZoom} />

      {shouldCluster
        ? groups.map((group) =>
            group.locations.length > 1 ? (
              <CountryCluster key={group.key} group={group} />
            ) : (
              group.locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.coords}
                  icon={location.type === "route" ? routeIcon : blogIcon}
                  title={`${location.name}, ${location.country}`}
                >
                  <LocationPopup location={location} />
                </Marker>
              ))
            ),
          )
        : locations.map((location) => (
            <Marker
              key={location.id}
              position={location.coords}
              icon={location.type === "route" ? routeIcon : blogIcon}
              title={`${location.name}, ${location.country}`}
            >
              <LocationPopup location={location} />
            </Marker>
          ))}

      <ZoomControl position="bottomleft" />
    </MapContainer>
  );
}
