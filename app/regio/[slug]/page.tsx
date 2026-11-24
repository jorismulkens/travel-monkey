import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Sparkles } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { RouteCard } from "@/components/route-card";
import { getRoutesByContinent } from "@/lib/content";
import { getRegion, regions } from "@/lib/regions";
import type { RegionSlug } from "@/lib/types";

interface RegionPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export function generateMetadata({ params }: RegionPageProps): Metadata {
  const region = getRegion(params.slug);

  if (!region) {
    return { title: "Regio niet gevonden" };
  }

  return {
    title: `${region.label} — reisroutes en tips`,
    description: region.description,
    alternates: {
      canonical: `/regio/${region.slug}`,
    },
  };
}

export default function RegionPage({ params }: RegionPageProps) {
  const region = getRegion(params.slug);

  if (!region) {
    notFound();
  }

  const routes = getRoutesByContinent(region.slug as RegionSlug);
  const total = routes.length;

  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-12 sm:pb-14 sm:pt-16">
        <div
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
          aria-hidden="true"
        >
          <div className="absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-sunset-100/70 blur-3xl" />
          <div className="absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full border border-jungle-900/10" />
        </div>

        <div className="container-wide relative">
          <div className="max-w-3xl">
            <Link
              href="/reizen"
              className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-jungle-600 transition-colors hover:text-sunset-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Alle routes
            </Link>
            <h1 className="mt-5 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.045em] text-jungle-950 sm:text-[4.2rem]">
              {region.label}
            </h1>
            <p className="mt-5 font-display text-[1.35rem] font-medium italic leading-snug text-sunset-700">
              {region.intro}
            </p>
            <p className="mt-5 max-w-xl text-[1.01rem] leading-8 text-jungle-800/85">
              {region.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="tag">
                <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                {total} {total === 1 ? "route" : "routes"}
              </span>
              <span className="tag">
                <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                {region.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {routes.length > 0 ? (
        <section className="pb-16 sm:pb-20">
          <div className="container-wide">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[1.8rem] font-semibold tracking-[-0.03em] text-jungle-950 sm:text-[2.2rem]">
                Complete routes
              </h2>
              <Link
                href={`/reizen?regio=${region.slug}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-jungle-900 transition-colors hover:text-sunset-600"
              >
                Filter op duur
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route, index) => (
                <Reveal key={route.slug} delay={(index % 3) * 70} className="h-full">
                  <RouteCard route={route} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-jungle-900/10 bg-sand-50 p-4 sm:p-5">
            <span className="mr-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
              Andere regio&apos;s
            </span>
            {regions
              .filter((item) => item.slug !== region.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/regio/${item.slug}`}
                  className="rounded-full bg-sand-100 px-3.5 py-1.5 text-sm font-medium text-jungle-800 transition-colors hover:bg-sand-200"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
