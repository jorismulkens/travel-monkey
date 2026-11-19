import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  Sparkles,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { getAllBlogPosts, paginatePosts } from "@/lib/content";
import { regions } from "@/lib/regions";
import type { PostKind } from "@/lib/types";

export const metadata: Metadata = {
  title: "Verhalen",
  description:
    "Reisroutes, tips en verhalen per regio: Azië, Midden-Amerika, Zuid-Amerika, Europa, Afrika, Midden-Oosten en Oceanië.",
  alternates: {
    canonical: "/blog",
  },
};

const kinds: { value: PostKind | "alles"; label: string }[] = [
  { value: "alles", label: "Alles" },
  { value: "reisroute", label: "Reisroutes" },
  { value: "tips", label: "Tips" },
  { value: "verhaal", label: "Verhalen" },
];

interface BlogListProps {
  searchParams: {
    regio?: string;
    soort?: string;
    pagina?: string;
  };
}

function buildUrl(params: {
  regio?: string;
  soort?: string;
  pagina?: number;
}) {
  const query = new URLSearchParams();

  if (params.regio && params.regio !== "alles") query.set("regio", params.regio);
  if (params.soort && params.soort !== "alles") query.set("soort", params.soort);
  if (params.pagina && params.pagina > 1) query.set("pagina", String(params.pagina));

  const suffix = query.toString();

  return suffix ? `/blog?${suffix}` : "/blog";
}

export default function BlogPage({ searchParams }: BlogListProps) {
  const allPosts = getAllBlogPosts();
  const activeRegion =
    regions.find((region) => region.slug === searchParams.regio)?.slug ?? "alles";
  const activeKind = kinds.some((kind) => kind.value === searchParams.soort)
    ? (searchParams.soort as PostKind | "alles")
    : "alles";
  const page = Number(searchParams.pagina ?? 1) || 1;

  const filtered = allPosts.filter((post) => {
    const regionMatch = activeRegion === "alles" || post.region === activeRegion;
    const kindMatch = activeKind === "alles" || post.kind === activeKind;
    return regionMatch && kindMatch;
  });

  const { posts, page: currentPage, totalPages, total } = paginatePosts(
    filtered,
    page,
    9,
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(
      (number) =>
        number === 1 ||
        number === totalPages ||
        Math.abs(number - currentPage) <= 1,
    )
    .slice(0, 7);

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
            <p className="eyebrow">Verhalen</p>
            <h1 className="mt-5 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.045em] text-jungle-950 sm:text-[4.2rem]">
              Verhalen, routes en{" "}
              <span className="italic text-sunset-600">tips.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.05rem] leading-8 text-jungle-800/85">
              Alles wat we opschreven, gesorteerd per regio. Begin bij een
              werelddeel of filter op reisroutes en tips.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="tag">
                <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                {allPosts.length} artikelen
              </span>
              <span className="tag">
                <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                {regions.length} regio&apos;s
              </span>
              <span className="tag">
                <Clock className="h-3.5 w-3.5 text-sunset-600" />
                Per regio
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-wide">
          <div className="rounded-[1.5rem] border border-jungle-900/10 bg-sand-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                Regio
              </span>
              <Link
                href={buildUrl({ soort: activeKind })}
                aria-current={activeRegion === "alles" ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeRegion === "alles"
                    ? "bg-jungle-900 text-sand-50"
                    : "bg-sand-100 text-jungle-800 hover:bg-sand-200"
                }`}
              >
                Alles
              </Link>
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={buildUrl({ regio: region.slug, soort: activeKind })}
                  aria-current={activeRegion === region.slug ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeRegion === region.slug
                      ? "bg-jungle-900 text-sand-50"
                      : "bg-sand-100 text-jungle-800 hover:bg-sand-200"
                  }`}
                >
                  {region.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-jungle-900/10 pt-3">
              <span className="mr-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                Soort
              </span>
              {kinds.map((kind) => (
                <Link
                  key={kind.value}
                  href={buildUrl({ regio: activeRegion, soort: kind.value })}
                  aria-current={activeKind === kind.value ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeKind === kind.value
                      ? "bg-jungle-900 text-sand-50"
                      : "bg-sand-100 text-jungle-800 hover:bg-sand-200"
                  }`}
                >
                  {kind.label}
                </Link>
              ))}
              <span className="ml-auto text-xs font-medium text-jungle-600">
                {total} {total === 1 ? "artikel" : "artikelen"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-wide">
          {posts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-jungle-900/20 bg-sand-100/60 px-6 py-16 text-center">
              <p className="font-display text-2xl font-semibold text-jungle-950">
                Hier staat nog niets.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-jungle-700/80">
                Kies een andere regio of bekijk alle artikelen.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-jungle-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-jungle-800"
              >
                Toon alles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={(index % 3) * 70} className="h-full">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label="Paginering"
            >
              <Link
                href={buildUrl({
                  regio: activeRegion,
                  soort: activeKind,
                  pagina: currentPage - 1,
                })}
                aria-disabled={currentPage === 1}
                className={`inline-flex items-center gap-1.5 rounded-full border border-jungle-900/15 px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "text-jungle-900 hover:bg-sand-100"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Vorige
              </Link>

              {pageNumbers.map((number, index) => {
                const previous = pageNumbers[index - 1];
                const gap = previous && number - previous > 1;

                return (
                  <span key={number} className="flex items-center gap-2">
                    {gap ? <span className="px-1 text-jungle-500">…</span> : null}
                    <Link
                      href={buildUrl({
                        regio: activeRegion,
                        soort: activeKind,
                        pagina: number,
                      })}
                      aria-current={number === currentPage ? "page" : undefined}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors ${
                        number === currentPage
                          ? "bg-jungle-900 text-sand-50"
                          : "text-jungle-800 hover:bg-sand-100"
                      }`}
                    >
                      {number}
                    </Link>
                  </span>
                );
              })}

              <Link
                href={buildUrl({
                  regio: activeRegion,
                  soort: activeKind,
                  pagina: currentPage + 1,
                })}
                aria-disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-1.5 rounded-full border border-jungle-900/15 px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "text-jungle-900 hover:bg-sand-100"
                }`}
              >
                Volgende
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          ) : null}
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-[2rem] bg-jungle-900 p-7 text-sand-100 sm:p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-sand-100/10"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                  Per regio
                </p>
                <h2 className="mt-3 font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.03em] text-sand-50 sm:text-[2.2rem]">
                  Liever per werelddeel lezen?
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-sand-200/75">
                  Kies een regio en je krijgt alle routes en tips uit dat deel
                  van de wereld op een rij.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                {regions.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regio/${region.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sand-100/25 px-3.5 py-2 text-sm font-medium text-sand-100 transition-colors hover:bg-sand-100/10"
                  >
                    {region.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
