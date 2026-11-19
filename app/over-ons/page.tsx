import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Close,
  Compass,
  Leaf,
  MapPin,
  Sparkles,
  Sun,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Travel Monkey is een reisblog over reizen met een omweg. Routes die we zelf liepen, tips die werken en verhalen van onderweg. Mila is de oprichter en schrijft de verhalen.",
  alternates: {
    canonical: "/over-ons",
  },
};

const values = [
  {
    icon: MapPin,
    title: "Wij lopen het eerst zelf.",
    body: "Geen route die we uit een brochure overtypten. Elke stop is ergens waar Mila zelf sliep, at of verdwaalde.",
  },
  {
    icon: Compass,
    title: "Langzamer is meestal beter.",
    body: "Drie nachten op één plek zeggen ons meer dan drie steden in drie dagen. Wij plannen ruimte voor niets doen.",
  },
  {
    icon: Leaf,
    title: "Eerlijk over wat niet werkt.",
    body: "De te dure taxi, de boot die niet ging, de plek die tegenviel. Dat hoort erbij, en het is vaak nuttig.",
  },
  {
    icon: Sun,
    title: "Prijs boven praatje.",
    body: "Wat we betaalden staat erbij, niet wat een website zegt dat het kost. Prijzen veranderen, dus check ze opnieuw.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "De eerste verre reis",
    text: "Drie weken Sri Lanka met een te zware rugzak en een veel te strak schema. De les: je hoeft niet elke dag iets te zien.",
  },
  {
    year: "2022",
    title: "Zes maanden Azië",
    text: "Werken, reizen en steeds langer blijven op plekken die niet op het lijstje stonden. Daar begon het schrijven.",
  },
  {
    year: "2024",
    title: "Bali, drie weken",
    text: "De route die nu op deze site staat. Gelopen, opgeschreven en thuisgekomen met een notitieboek vol prijzen en omwegen.",
  },
  {
    year: "2025",
    title: "Terug naar dezelfde plekken",
    text: "Teruggegaan om te controleren wat nog klopte. Sommige prijzen waren gestegen, sommige tips bleken nog steeds goud.",
  },
];

const niet = [
  "We boeken niets voor je",
  "We krijgen geen commissie",
  "We doen niet aan sponsoring",
];

export default function OverOnsPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full border border-jungle-900/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-sunset-100/60 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-wide relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr]">
            <div>
              <p className="eyebrow">Over ons</p>
              <h1 className="mt-5 font-display text-[3rem] font-semibold leading-[0.98] tracking-[-0.045em] text-jungle-950 sm:text-[4.4rem] lg:text-[4.8rem]">
                Wij zijn{" "}
                <span className="italic text-sunset-600">Travel Monkey.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[1.05rem] leading-8 text-jungle-800/85">
                Een reisblog over reizen met een omweg. Begonnen als het
                notitieboek van Mila — prijzen, boottijden en dingen die
                misgingen — en nu een plek waar we opschrijven wat we zelf
                meemaakten.
              </p>
              <p className="mt-5 max-w-xl text-[1.01rem] leading-8 text-jungle-800/80">
                Klein betekent bij ons: geen redactie vol persberichten, maar
                verhalen van iemand die er zelf was. En die ook zegt wanneer iets
                tegenviel.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="tag">
                  <MapPin className="h-3.5 w-3.5 text-sunset-600" />
                  Utrecht, Nederland
                </span>
                <span className="tag">
                  <Compass className="h-3.5 w-3.5 text-sunset-600" />
                  14 maanden in Azië
                </span>
                <span className="tag">
                  <Sparkles className="h-3.5 w-3.5 text-sunset-600" />
                  Sinds 2022
                </span>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/reizen" className="button-primary">
                  Bekijk de routes
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/blog" className="button-secondary">
                  Lees de verhalen
                  <ArrowUpRight className="h-4 w-4 text-sunset-600" />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
              <div className="absolute -left-3 top-4 z-20 h-8 w-24 -rotate-6 bg-sunset-200/80 shadow-sm" />
              <div className="absolute -top-5 right-7 z-20 rotate-6 rounded-full border border-white/60 bg-sunset-500 px-5 py-3 text-center shadow-sticker">
                <p className="font-display text-sm font-semibold italic text-white">
                  klein label
                </p>
                <p className="text-[0.52rem] font-bold uppercase tracking-[0.15em] text-sunset-100">
                  sinds 2022
                </p>
              </div>

              <div className="relative ml-auto aspect-[4/5] w-[86%] overflow-hidden rounded-[2.5rem] border-[5px] border-sand-50 bg-sand-200 shadow-card">
                <Image
                  src="/images/traveler-portrait.jpg"
                  alt="Mila, oprichter van Travel Monkey"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-jungle-950/45 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-5 right-5 max-w-[52%] text-right">
                  <p className="font-display text-lg font-medium italic leading-tight text-white">
                    Altijd een notitieboek bij me.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-7 left-0 w-[45%] -rotate-6 overflow-hidden rounded-2xl border-4 border-sand-50 bg-sand-50 shadow-sticker">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/bali-backpacker.jpg"
                    alt="Mila wandelt met haar rugzak door ondiep water in Bali"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <p className="px-2 pb-1 pt-2 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-jungle-700">
                  Bali · natte schoenen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <Reveal>
            <div className="grid overflow-hidden rounded-[2.25rem] border border-jungle-900/10 bg-sand-100/70 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-[21rem] overflow-hidden lg:min-h-full">
                <Image
                  src="/images/bali-cooking.jpg"
                  alt="Kruiden en specerijen voor een kookles in Bali"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-jungle-950/60 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute bottom-5 left-5 rounded-full bg-sand-50/95 px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-jungle-900 backdrop-blur">
                  Ubud · kookles
                </span>
              </div>

              <div className="p-7 sm:p-12 lg:p-14">
                <p className="eyebrow">Waarom Travel Monkey?</p>
                <h2 className="mt-4 font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-jungle-950 sm:text-[3rem]">
                  Een aap, een rugzak en{" "}
                  <span className="italic text-sunset-600">te veel koffie.</span>
                </h2>
                <div className="prose-tm mt-6">
                  <p>
                    Tijdens een wandeling in Munduk noemde een vriend Mila voor
                    het eerst een travel monkey. Niet omdat ze zo handig is, maar
                    omdat ze overal aan wil zitten, alles wil proeven en soms te
                    lang in een boom blijft zitten kijken.
                  </p>
                  <p>
                    De naam bleef hangen. De aap staat voor nieuwsgierigheid,
                    niet voor luxe. Op deze site vind je dus geen vijfsterren
                    resorts of perfecte stockfoto&apos;s, maar routes zoals ze
                    echt gelopen zijn: met homestays, warungs en een enkele
                    verkeerde boot.
                  </p>
                </div>
                <p className="mt-7 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sunset-700">
                  <span className="animate-wag text-xl">🐒</span>
                  Nieuwsgierig, niet netjes
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand-100/70 py-20 sm:py-24 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Onze reisregels"
            title={
              <>
                Vier dingen die wij{" "}
                <span className="italic text-sunset-600">altijd doen.</span>
              </>
            }
            description="Geen filosofie voor op een tegeltje. Gewoon de gewoontes die onze reizen beter maken."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <Reveal key={value.title} delay={index * 80} className="h-full">
                  <div className="group flex h-full gap-4 rounded-[1.5rem] border border-jungle-900/10 bg-sand-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft sm:p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-jungle-900 text-sand-50 transition-colors group-hover:bg-sunset-500">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-jungle-950">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                        {value.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="eyebrow">Wie je spreekt</p>
              <h2 className="mt-4 max-w-md font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-jungle-950 sm:text-[3rem]">
                Mila, oprichter en{" "}
                <span className="italic text-sunset-600">routeontwerper.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-jungle-700/80">
                Mila reist het liefst met een rugzak en heeft een gezonde hekel
                aan reisschema&apos;s die om 06.00 beginnen omdat een gids dat
                wil. Toch staat ze vaak vroeg op — voor rijstvelden, dolfijnen
                en de enige klif zonder rij.
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-jungle-700/80">
                Naast het reizen werkt ze, en dat is precies waarom de verhalen
                nuchter blijven: geen oneindige vakantie, wel bewust kiezen waar
                de vrije dagen naartoe gaan.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-jungle-900/10 pt-6">
                <div>
                  <p className="font-display text-3xl font-semibold text-jungle-950">
                    11
                  </p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
                    landen
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-jungle-950">
                    1
                  </p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
                    rugzak
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-jungle-950">
                    0
                  </p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
                    strakke schema&apos;s
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-jungle-900/10 bg-sand-50 p-5">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-jungle-600">
                  Wat we niet doen
                </p>
                <ul className="mt-3 space-y-2">
                  {niet.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-jungle-700/85"
                    >
                      <Close className="h-3.5 w-3.5 text-sunset-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ol className="relative space-y-7 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-px before:bg-jungle-900/15">
              {timeline.map((item) => (
                <li key={item.year} className="relative pl-12">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-shell bg-sunset-500 text-[0.62rem] font-bold text-white">
                    {item.year}
                  </span>
                  <div className="rounded-2xl border border-jungle-900/10 bg-sand-50 p-5">
                    <h3 className="font-display text-xl font-semibold text-jungle-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-jungle-700/80">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-jungle-900 p-8 text-sand-100 sm:rounded-[2.75rem] sm:p-14">
              <div
                className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-sand-100/10"
                aria-hidden="true"
              />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="inline-flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-sunset-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Klaar om te lezen?
                  </p>
                  <h2 className="mt-4 max-w-2xl font-display text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.035em] text-sand-50 sm:text-[2.9rem]">
                    Begin bij de route of bij de verhalen.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-sand-200/75">
                    Alles staat er gratis op, precies zoals we het meemaakten —
                    met de prijzen, de omwegen en de fouten erbij.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/reizen/bali-3-weken"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-sunset-500 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sunset-400"
                  >
                    Bekijk de Bali-route
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sand-100/25 px-6 py-3.5 text-sm font-semibold text-sand-100 transition-colors hover:bg-sand-100/10"
                  >
                    Lees de verhalen
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
