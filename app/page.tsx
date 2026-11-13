import Image from "next/image";
import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import { HomeHero } from "@/components/home-hero";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  MapPin,
  Sparkles,
  Sun,
  Wallet,
} from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { MonkeyMark } from "@/components/monkey-mark";
import { Reveal } from "@/components/reveal";
import { RouteCard } from "@/components/route-card";
import { SectionHeading } from "@/components/section-heading";
import { WorldMapSection } from "@/components/world-map-section";
import {
  getAllBlogPosts,
  getAllRoutes,
  getLocations,
} from "@/lib/content";

export default function HomePage() {
  const routes = getAllRoutes();
  const posts = getAllBlogPosts();
  const locations = getLocations();
  const route = routes[0];

  if (!route) {
    return null;
  }

  return (
    <>
      <HomeHero route={route} />
      <Marquee />

      <section className="section-space">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Route van dit seizoen"
            title={
              <>
                Eerst maar eens{" "}
                <span className="italic text-sunset-600">Bali.</span>
              </>
            }
            description="Drie weken, acht plekken en precies genoeg ruimte om een dag niets te doen. Deze route begint in de rijstvelden en eindigt met je voeten in het zand."
            action={{ href: "/reizen", label: "Alle reisroutes" }}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.28fr_0.72fr]">
            <Reveal className="h-full">
              <RouteCard route={route} featured />
            </Reveal>

            <Reveal delay={120} className="h-full">
              <aside className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-jungle-900 p-7 text-sand-100 shadow-soft sm:p-9">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-sand-100/10"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full border border-sand-100/10"
                  aria-hidden="true"
                />

                <div className="relative">
                  <p className="inline-flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    De route in het kort
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-sand-50 sm:text-[2.4rem]">
                    Een rugzak, drie weken, acht plekken.
                  </h3>

                  <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-6 border-y border-sand-100/15 py-6">
                    <div>
                      <dt className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sand-300/75">
                        <Calendar className="h-3.5 w-3.5 text-sunset-400" />
                        Duur
                      </dt>
                      <dd className="mt-1.5 font-display text-lg font-semibold text-sand-50">
                        {route.durationLabel}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sand-300/75">
                        <Wallet className="h-3.5 w-3.5 text-sunset-400" />
                        Budget
                      </dt>
                      <dd className="mt-1.5 font-display text-lg font-semibold text-sand-50">
                        {route.budget}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sand-300/75">
                        <MapPin className="h-3.5 w-3.5 text-sunset-400" />
                        Start → eind
                      </dt>
                      <dd className="mt-1.5 font-display text-lg font-semibold text-sand-50">
                        {route.startPoint} → {route.endPoint}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sand-300/75">
                        <Sun className="h-3.5 w-3.5 text-sunset-400" />
                        Beste tijd
                      </dt>
                      <dd className="mt-1.5 text-sm font-semibold leading-5 text-sand-50">
                        {route.bestTime}
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-7 space-y-3">
                    {route.highlights.slice(0, 4).map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5 text-sm text-sand-200/85"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sunset-500/20 text-sunset-300">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative mt-auto pt-8">
                  <Link
                    href={`/reizen/${route.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-full bg-sand-50 px-5 py-3.5 text-sm font-semibold text-jungle-950 transition-all duration-300 hover:bg-sunset-500 hover:text-white"
                  >
                    Open de volledige route
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jungle-900 text-sand-50 transition-colors group-hover:bg-white group-hover:text-sunset-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-sand-100/70">
        <WorldMapSection locations={locations} />
      </div>

      <section className="section-space">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Nieuwe verhalen"
            title={
              <>
                Wat ik onderweg{" "}
                <span className="italic text-sunset-600">opschreef.</span>
              </>
            }
            description="Geen handleidingen met tien tips, maar wat ik zelf deed, betaalde en soms verkeerd deed. Met ruimte voor twijfel."
            action={{ href: "/blog", label: "Alle verhalen" }}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {posts.slice(0, 2).map((post, index) => (
              <Reveal key={post.slug} delay={index * 100} className="h-full">
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-jungle-900 text-sand-100 sm:rounded-[2.75rem]">
              <div
                className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-sand-100/10"
                aria-hidden="true"
              />
              <div className="grid lg:grid-cols-[0.74fr_1.26fr]">
                <div className="relative min-h-[22rem] overflow-hidden lg:min-h-full">
                  <Image
                    src="/images/traveler-portrait.jpg"
                    alt="Mila, de reiziger achter Travel Monkey"
                    fill
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-jungle-950/70 via-transparent to-transparent lg:bg-gradient-to-r"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-5 left-5 rounded-full bg-sand-50/95 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-jungle-900 backdrop-blur">
                    Hoi, ik ben Mila
                  </div>
                </div>

                <div className="relative p-8 sm:p-12 lg:p-16">
                  <span
                    className="absolute right-8 top-8 animate-wag text-3xl sm:right-12 sm:top-12"
                    aria-hidden="true"
                  >
                    🐒
                  </span>
                  <p className="eyebrow text-sunset-300 before:bg-sunset-400">
                    Achter de site
                  </p>
                  <blockquote className="mt-5 max-w-2xl font-display text-[1.85rem] font-medium leading-[1.2] tracking-[-0.025em] text-sand-50 sm:text-[2.35rem]">
                    &ldquo;Ik ben geen reisprofessor. Ik ben iemand die te veel
                    koffie drinkt en te lang blijft hangen op plekken die niet
                    op mijn lijstje stonden.&rdquo;
                  </blockquote>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-sand-200/75">
                    Travel Monkey begon als een notitieboek vol prijzen,
                    boottijden en fouten. Die notities zijn nu routes en
                    verhalen waar jij iets aan hebt. Geen perfecte plaatjes,
                    wel eerlijk reizen.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link
                      href="/over"
                      className="group inline-flex items-center gap-2 rounded-full bg-sand-50 px-5 py-3 text-sm font-semibold text-jungle-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sunset-500 hover:text-white"
                    >
                      Leer me kennen
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <span className="text-xs font-medium text-sand-300/70">
                      Utrecht · 14 maanden in Azië · nog steeds slechte
                      landkaarten
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-sunset-500 px-6 py-14 text-center text-white sm:rounded-[2.75rem] sm:px-12 sm:py-16">
              <div
                className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-white/15"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-28 -right-10 h-72 w-72 rounded-full border border-white/15"
                aria-hidden="true"
              />
              <MonkeyMark size={58} className="mx-auto ring-4 ring-white/20" />
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[3rem]">
                Pak je rugzak. De rest komt onderweg.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-sunset-50/90 sm:text-base">
                Begin met de route die ik zelf liep, of lees eerst hoe een
                ochtend in Ubud eruitziet. Beide zijn een goede eerste stap.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/reizen/bali-3-weken"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-jungle-950 px-6 py-3.5 text-sm font-semibold text-sand-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-jungle-900"
                >
                  Naar de Bali-route
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/blog/een-ochtend-in-ubud"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Lees het Ubud-verhaal
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
