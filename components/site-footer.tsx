import Link from "next/link";

import { ArrowUpRight } from "@/components/icons";
import { MonkeyMark } from "@/components/monkey-mark";

const footerLinks = [
  { href: "/reizen", label: "Reisroutes" },
  { href: "/tips", label: "Tips" },
  { href: "/over-ons", label: "Over ons" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-jungle-950 text-sand-100">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-sand-100/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-sand-100/10"
        aria-hidden="true"
      />

      <div className="container-wide relative py-16 md:py-20">
        <div className="grid gap-12 border-b border-sand-100/15 pb-14 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
          <div>
            <div className="flex items-center gap-3">
              <MonkeyMark size={52} />
              <div>
                <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
                  Travel Monkey
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-sand-300">
                  Reizen met een omweg
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-[0.95rem] leading-7 text-sand-200/80">
              Complete reisroutes met vaste stops, prijzen en tips. Van een
              week Europa tot drie weken Azië. Geen perfecte plaatjes, wel
              eerlijk reizen.
            </p>
            <Link
              href="/reizen"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-sunset-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sunset-400"
            >
              Bekijk de routes
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-300/70">
              Bladeren
            </p>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sand-100/80 transition-colors hover:text-sunset-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 text-xs text-sand-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Travel Monkey. Gemaakt met nieuwsgierigheid.</p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-medium text-sand-200 transition-colors hover:text-sunset-300"
          >
            Terug naar boven
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
