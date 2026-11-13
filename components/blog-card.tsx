import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, Clock, MapPin } from "@/components/icons";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "wide" | "compact";
  className?: string;
}

export function BlogCard({
  post,
  variant = "default",
  className,
}: BlogCardProps) {
  if (variant === "wide") {
    return (
      <article
        className={cn(
          "group grid overflow-hidden rounded-[2rem] border border-jungle-900/10 bg-sand-50 shadow-[0_16px_45px_-34px_rgba(27,42,35,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card md:grid-cols-[1.1fr_0.9fr]",
          className,
        )}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="relative min-h-[20rem] overflow-hidden bg-sand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sunset-500"
          aria-label={`Lees: ${post.title}`}
        >
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-jungle-950/30 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-sand-50/95 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-jungle-900 backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-sunset-600" />
            {post.location.name}
          </span>
        </Link>

        <div className="flex flex-col justify-center p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-jungle-600">
            <span className="text-sunset-700">{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-jungle-400" />
            <span>{post.displayDate}</span>
            <span className="h-1 w-1 rounded-full bg-jungle-400" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[1.8rem] font-semibold leading-[1.08] tracking-[-0.03em] text-jungle-950 sm:text-[2.15rem]">
            <Link
              href={`/blog/${post.slug}`}
              className="transition-colors hover:text-sunset-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-4 text-sm leading-7 text-jungle-700/80">
            {post.excerpt}
          </p>
          <Link
            href={`/blog/${post.slug}`}
            className="group/link mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-jungle-900 transition-colors hover:text-sunset-600"
          >
            Lees het verhaal
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link
          href={`/blog/${post.slug}`}
          className="flex gap-4 rounded-2xl p-2 transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500"
        >
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand-200">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0 py-1">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-sunset-700">
              {post.category}
            </p>
            <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-jungle-950">
              {post.title}
            </h3>
            <p className="mt-2 text-xs text-jungle-600">{post.readingTime}</p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[2rem] border border-jungle-900/10 bg-sand-50 p-2.5 shadow-[0_16px_45px_-34px_rgba(27,42,35,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-jungle-900/20 hover:shadow-card",
        className,
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col rounded-[1.55rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 focus-visible:ring-offset-4 focus-visible:ring-offset-sand-50"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.55rem] bg-sand-200">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-jungle-950/35 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sand-50/95 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-jungle-900 backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-sunset-600" />
            {post.location.name}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 pt-5 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-jungle-600">
            <span className="text-sunset-700">{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-jungle-400" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
          <h3 className="mt-3 font-display text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.03em] text-jungle-950 transition-colors group-hover:text-sunset-800">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-jungle-700/80">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="text-xs text-jungle-600">{post.displayDate}</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-jungle-900 transition-colors group-hover:text-sunset-600">
              Lees verder
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
