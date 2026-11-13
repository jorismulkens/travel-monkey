import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Sparkles,
} from "@/components/icons";
import { LocationCard } from "@/components/location-card";
import { MiniMapWrapper } from "@/components/mini-map-wrapper";
import { MonkeyMark } from "@/components/monkey-mark";
import { SectionHeading } from "@/components/section-heading";
import {
  getAllBlogPosts,
  getBlogPost,
  getRelatedLocations,
  getRoute,
} from "@/lib/content";
import { siteUrl } from "@/lib/site";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Verhaal niet gevonden",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: ["Mila — Travel Monkey"],
      images: [
        {
          url: post.coverImage,
          alt: post.coverAlt,
        },
      ],
    },
  };
}

export default function BlogDetailPage({ params }: BlogPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const nextPost =
    allPosts.length > 1
      ? allPosts[(currentIndex + 1 + allPosts.length) % allPosts.length]
      : undefined;
  const relatedLocations = getRelatedLocations(post.relatedLocationIds);
  const relatedRoute = getRoute(post.relatedRouteSlug);
  const sectionsWithHeadings = post.sections
    .map((section, index) => ({ ...section, index }))
    .filter((section) => Boolean(section.heading));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.coverImage}`,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Mila",
    },
    publisher: {
      "@type": "Organization",
      name: "Travel Monkey",
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-wide pt-6">
        <nav
          className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-jungle-600"
          aria-label="Kruimelpad"
        >
          <Link href="/" className="transition-colors hover:text-sunset-700">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="transition-colors hover:text-sunset-700">
            Verhalen
          </Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[16rem] truncate text-jungle-900 sm:max-w-none">
            {post.location.name}
          </span>
        </nav>
      </div>

      <article>
        <header className="relative overflow-hidden pb-12 pt-10 sm:pb-16 sm:pt-14">
          <div
            className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-sunset-100/60 blur-3xl"
            aria-hidden="true"
          />
          <div className="container-wide relative">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-jungle-600">
                <span className="rounded-full bg-sunset-100 px-3 py-1.5 text-sunset-800">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sunset-600" />
                  <time dateTime={post.date}>{post.displayDate}</time>
                </span>
                <span className="h-1 w-1 rounded-full bg-jungle-400" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sunset-600" />
                  {post.readingTime}
                </span>
              </div>

              <h1 className="mt-6 font-display text-[2.55rem] font-semibold leading-[1.01] tracking-[-0.045em] text-jungle-950 sm:text-[4rem] lg:text-[4.5rem]">
                {post.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[1.02rem] leading-8 text-jungle-800/80">
                {post.excerpt}
              </p>

              <div className="mt-8 flex items-center justify-center gap-3">
                <MonkeyMark size={42} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-jungle-950">Mila</p>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.13em] text-jungle-600">
                    Reiziger achter Travel Monkey
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border-[5px] border-sand-50 bg-sand-200 shadow-card sm:mt-12 sm:rounded-[2.5rem]">
              <div className="relative aspect-[4/3] sm:aspect-[16/9]">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt}
                  fill
                  priority
                  sizes="(min-width: 1260px) 1180px, 100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-jungle-950/35 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-sand-50/95 px-3.5 py-2 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-jungle-900 backdrop-blur sm:bottom-6 sm:left-6">
                <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                {post.location.name}, {post.location.country}
              </div>
            </div>
          </div>
        </header>

        <div className="container-wide pb-16 sm:pb-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
            <div className="mx-auto w-full max-w-[46rem] lg:mx-0">
              <div className="prose-tm">
                {post.intro.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? "text-[1.12rem] leading-8 first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-display first-letter:text-[3.6rem] first-letter:font-semibold first-letter:leading-[0.7] first-letter:text-sunset-600 sm:text-[1.2rem] sm:leading-9"
                        : "text-[1.02rem] leading-8"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 space-y-12">
                {post.sections.map((section, index) => (
                  <section
                    key={`${post.slug}-section-${index}`}
                    id={`sectie-${index}`}
                    className="scroll-mt-28"
                  >
                    {section.heading ? (
                      <h2 className="font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] text-jungle-950 sm:text-[2.4rem]">
                        {section.heading}
                      </h2>
                    ) : null}

                    {section.paragraphs ? (
                      <div className="prose-tm mt-5">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ) : null}

                    {section.list ? (
                      <ul className="mt-6 space-y-3">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[0.98rem] leading-7 text-jungle-800"
                          >
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sunset-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.quote ? (
                      <blockquote className="relative mt-8 rounded-r-2xl border-l-2 border-sunset-500 bg-sunset-50/70 py-5 pl-6 pr-5 sm:pl-8">
                        <p className="font-display text-[1.35rem] font-medium italic leading-[1.4] tracking-[-0.015em] text-jungle-900 sm:text-[1.6rem]">
                          &ldquo;{section.quote}&rdquo;
                        </p>
                      </blockquote>
                    ) : null}

                    {section.image ? (
                      <figure className="mt-8">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-sand-200">
                          <Image
                            src={section.image.src}
                            alt={section.image.alt}
                            fill
                            sizes="(min-width: 1024px) 46rem, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="mt-3 flex items-start gap-2 text-xs leading-5 text-jungle-600">
                          <span className="mt-1.5 h-1 w-4 shrink-0 bg-sunset-400" />
                          {section.image.caption}
                        </figcaption>
                      </figure>
                    ) : null}
                  </section>
                ))}
              </div>

              <aside className="mt-12 flex gap-4 rounded-[1.5rem] border border-sunset-200/80 bg-sunset-50 p-5 sm:p-6">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sunset-600" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-800">
                    Praktisch
                  </p>
                  <p className="mt-2 text-sm leading-7 text-jungle-800">
                    {post.tip}
                  </p>
                </div>
              </aside>

              <div className="mt-10 flex items-center gap-4 border-t border-jungle-900/10 pt-8">
                <MonkeyMark size={54} />
                <div>
                  <p className="font-display text-lg font-semibold text-jungle-950">
                    Geschreven door Mila
                  </p>
                  <p className="mt-1 text-sm leading-6 text-jungle-700/75">
                    Ik schrijf op wat ik zelf meemaak, met de prijzen die ik
                    betaalde. Geen sponsoring, geen filter.
                  </p>
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-[1.75rem] border border-jungle-900/10 bg-sand-50 p-2 shadow-soft">
                <div className="relative h-52 overflow-hidden rounded-[1.15rem] bg-sand-200">
                  <MiniMapWrapper
                    name={post.location.name}
                    country={post.location.country}
                    coords={post.location.coords}
                  />
                  <span className="pointer-events-none absolute left-3 top-3 z-[500] rounded-full bg-sand-50/95 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-jungle-900 backdrop-blur">
                    Waar dit is
                  </span>
                </div>
                <div className="px-3 pb-3 pt-4">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                    {post.location.country}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-jungle-950">
                    {post.location.name}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-jungle-700/75">
                    {post.subtitle}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${post.location.coords[0]},${post.location.coords[1]}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-jungle-900 transition-colors hover:text-sunset-600"
                  >
                    Open in Google Maps
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {sectionsWithHeadings.length > 0 ? (
                <nav className="rounded-[1.5rem] border border-jungle-900/10 bg-sand-100/60 p-5">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                    In dit verhaal
                  </p>
                  <ol className="mt-3 space-y-2">
                    {sectionsWithHeadings.map((section) => (
                      <li key={`nav-${section.index}`}>
                        <a
                          href={`#sectie-${section.index}`}
                          className="group flex gap-2.5 text-xs leading-5 text-jungle-700 transition-colors hover:text-sunset-700"
                        >
                          <span className="font-display font-semibold text-sunset-600">
                            {String(section.index + 1).padStart(2, "0")}
                          </span>
                          <span>{section.heading}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {relatedRoute ? (
                <div className="relative overflow-hidden rounded-[1.75rem] bg-jungle-900 p-6 text-sand-100">
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-sand-100/10"
                    aria-hidden="true"
                  />
                  <Compass className="h-6 w-6 text-sunset-400" />
                  <p className="mt-4 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sunset-300">
                    De hele route
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-sand-50">
                    3 weken Bali, van begin tot eind.
                  </h2>
                  <Link
                    href={`/reizen/${relatedRoute.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sand-100 underline decoration-sand-100/30 underline-offset-4 transition-colors hover:text-sunset-300"
                  >
                    Bekijk de route
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </article>

      <section className="bg-sand-100/70 py-20 sm:py-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Gerelateerde plekken"
            title={
              <>
                Waar dit verhaal{" "}
                <span className="italic text-sunset-600">begon.</span>
              </>
            }
            description="De plekken die in dit verhaal voorkomen, met de route en het andere verhaal erbij."
            action={{ href: "/reizen", label: "Alle reisroutes" }}
          />
          <div className="mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
            {relatedLocations.map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {nextPost ? (
        <section className="section-space">
          <div className="container-wide">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-jungle-800 transition-colors hover:text-sunset-600"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Alle verhalen
              </Link>
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-jungle-500">
                Volgend verhaal
              </span>
            </div>
            <BlogCard post={nextPost} variant="wide" />
          </div>
        </section>
      ) : null}
    </>
  );
}
