import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowUpRight } from "@/components/icons";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" &&
          "mx-auto max-w-2xl text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.035em] text-jungle-950 sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-jungle-700/80">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-jungle-900/25 pb-1 text-sm font-semibold text-jungle-900 transition-colors hover:border-sunset-500 hover:text-sunset-600"
        >
          {action.label}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
