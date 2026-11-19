"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowUpRight, Close, Menu } from "@/components/icons";
import { MonkeyMark } from "@/components/monkey-mark";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/reizen", label: "Reizen" },
  { href: "/tips", label: "Tips" },
  { href: "/blog", label: "Verhalen" },
  { href: "/over-ons", label: "Over ons" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-jungle-900/10 bg-shell/90 backdrop-blur-xl">
      <div className="container-wide flex h-[4.6rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 focus-visible:ring-offset-4 focus-visible:ring-offset-shell"
          aria-label="Travel Monkey — naar de homepage"
        >
          <MonkeyMark
            size={42}
            className="transition-transform duration-500 group-hover:-rotate-6"
          />
          <span className="leading-none">
            <span className="block font-display text-[1.32rem] font-semibold tracking-[-0.03em] text-jungle-900">
              Travel Monkey
            </span>
            <span className="mt-1 hidden whitespace-nowrap text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-jungle-600 sm:block">
              Reizen met een omweg
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Hoofdnavigatie"
        >
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-jungle-900"
                    : "text-jungle-700 hover:text-jungle-900",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-sunset-500 transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="group hidden items-center gap-2 rounded-full bg-jungle-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-jungle-800 hover:shadow-soft lg:inline-flex"
          >
            Lees de verhalen
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-jungle-900/15 text-jungle-900 transition-colors hover:bg-jungle-900 hover:text-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobiel-menu"
            aria-label={isOpen ? "Menu sluiten" : "Menu openen"}
          >
            {isOpen ? (
              <Close className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobiel-menu"
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-b border-jungle-900/10 bg-shell shadow-soft transition-[max-height,opacity] duration-300 md:hidden",
          isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav
          className="container-wide flex flex-col gap-1 py-5"
          aria-label="Mobiele navigatie"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3.5 font-display text-2xl font-medium text-jungle-900 transition-colors hover:bg-sand-100"
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/blog"
            className="mt-3 inline-flex items-center justify-between rounded-2xl bg-jungle-900 px-4 py-4 font-semibold text-sand-50"
            tabIndex={isOpen ? 0 : -1}
          >
            Lees de verhalen
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
