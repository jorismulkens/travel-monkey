import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  Sparkles,
} from "@/components/icons";
import { MonkeyMark } from "@/components/monkey-mark";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Verhalen",
  description:
    "Persoonlijke reisverhalen met praktische lessen. Over een vroege ochtend in Ubud, Nusa Penida zonder tour en de dingen die ik onderweg leerde.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [featuredPost, ...otherPosts] = posts;
  const secondaryPost = otherPosts[0];

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div
          className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-sunset-100/60 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-wide relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow">Verhalen</p>
              <h1 className="mt-5 max-w-2xl font-display text-[2.8rem] font-semibold leading-[0.99] tracking-[-0.045em] text-jungle-950 sm:text-[4.1rem]">
                Verhalen met{" "}
                <span className="italic text-sunset-600">zand in de zoom.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.01rem] leading-8 text-jungle-800/80">
                Geen tien tips die je al honderd keer las. Wel wat ik op een
                ochtend deed, wat het kostte, en waarom ik soms de verkeerde
                afslag nam.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="tag">
                  <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                  {posts.length} verhalen
                </span>
                <span className="tag">
                  <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                  Bali, Indonesië
                </span>
                <span className="tag">
                  <Clock className="h-3.5 w-3.5 text-sunset-600" />
                  Echte prijzen
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
              <div className="relative ml-auto aspect-[4/3] w-[86%] overflow-hidden rounded-[2.2rem] border-[5px] border-sand-50 bg-sand-200 shadow-card">
                <Image
                  src="/images/ubud-green.jpg"
                  alt="Rijstterrassen bij Ubud"
                  fill
                  priority
                  sizes="(min-width: 1024px) 36vw, 80vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-sand-50/95 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-jungle-900 backdrop-blur">
                  Ubud · 06.20
                </span>
              </div>
              <div className="absolute -bottom-7 left-0 w-[48%] -rotate-6 overflow-hidden rounded-2xl border-4 border-sand-50 bg-sand-50 shadow-sticker">
                <div className="relative aspect-square">
                  <Image
                    src="/images/nusa-diamond.jpg"
                    alt="Diamond Beach op Nusa Penida"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <p className="px-2 pb-1 pt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-jungle-700">
                  Nusa Penida · 07.10
                </p>
              </div>
              <div className="absolute -right-2 top-6 rotate-6 rounded-full bg-jungle-900 px-4 py-3 text-center shadow-sticker">
                <p className="font-display text-xl font-semibold leading-none text-sand-50">
                  02
                </p>
                <p className="mt-1 text-[0.52rem] font-bold uppercase tracking-[0.15em] text-sand-300">
                  verhalen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Het nieuwste"
            title={
              <>
                Vers van de{" "}
                <span className="italic text-sunset-600">reis.</span>
              </>
            }
            description="Ik schrijf pas als ik thuis ben en de was heb gedaan. Daardoor zijn de verhalen misschien iets minder spontaan, maar wel eerlijk."
          />

          {featuredPost ? (
            <Reveal className="mt-10">
              <BlogCard post={featuredPost} variant="wide" />
            </Reveal>
          ) : null}

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            {secondaryPost ? (
              <Reveal delay={80} className="h-full">
                <BlogCard post={secondaryPost} />
              </Reveal>
            ) : null}

            <Reveal delay={150} className="h-full">
              <aside className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-jungle-900 p-7 text-sand-100 sm:p-9">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sand-100/10"
                  aria-hidden="true"
                />
                <div className="relative">
                  <MonkeyMark size={52} />
                  <p className="mt-7 text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                    Waarom ik dit opschrijf
                  </p>
                  <blockquote className="mt-3 font-display text-[1.8rem] font-medium leading-[1.15] tracking-[-0.025em] text-sand-50 sm:text-[2.15rem]">
                    &ldquo;De beste tips kreeg ik niet van een website, maar van
                    iemand die net terugkwam met een natte rugzak.&rdquo;
                  </blockquote>
                  <p className="mt-5 text-sm leading-7 text-sand-200/75">
                    Dat is precies wat ik hier wil zijn: die iemand. Met de
                    gewone dingen die helpen, en de fouten die je kunt
                    vermijden.
                  </p>
                </div>
                <div className="relative mt-auto flex flex-wrap items-center gap-4 pt-8">
                  <Link
                    href="/over"
                    className="group inline-flex items-center gap-2 rounded-full bg-sand-50 px-5 py-3 text-sm font-semibold text-jungle-950 transition-colors hover:bg-sunset-500 hover:text-white"
                  >
                    Over Mila
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/reizen/bali-3-weken"
                    className="text-sm font-semibold text-sand-200 underline decoration-sand-200/30 decoration-1 underline-offset-4 transition-colors hover:text-sunset-300"
                  >
                    Bekijk de Bali-route
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>

          <Reveal className="mt-16">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-jungle-900/10 bg-sand-100/60 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sunset-100 text-sunset-700">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-jungle-950">
                    Nieuwe verhalen komen vanzelf.
                  </h2>
                  <p className="mt-1 text-sm text-jungle-700/75">
                    Geen nieuwsbrief, geen spam. Gewoon af en toe een nieuw
                    verhaal als ik iets te vertellen heb.
                  </p>
                </div>
              </div>
              <Link
                href="/reizen/bali-3-weken"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-jungle-900 transition-colors hover:text-sunset-600"
              >
                Begin met de route
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
