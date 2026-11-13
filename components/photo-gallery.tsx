"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArrowLeft, ArrowRight, Close, Expand } from "@/components/icons";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  images: GalleryImage[];
}

const layoutClasses = [
  "col-span-2 aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto",
  "col-span-1 aspect-square md:aspect-auto",
  "col-span-1 aspect-square md:aspect-auto",
  "col-span-1 aspect-square md:aspect-auto",
  "col-span-1 aspect-square md:aspect-auto",
  "col-span-2 aspect-[2/1] md:col-span-2 md:aspect-auto",
  "col-span-1 aspect-square md:aspect-auto",
  "col-span-1 aspect-square md:aspect-auto",
];

export function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrevious]);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-sand-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 focus-visible:ring-offset-4 focus-visible:ring-offset-shell md:rounded-3xl",
              layoutClasses[index] ??
                "col-span-1 aspect-square md:aspect-auto",
            )}
            aria-label={`Vergroot foto: ${image.caption}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-jungle-950/70 via-transparent to-transparent opacity-65 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
              <span className="line-clamp-2 max-w-[85%] text-[0.7rem] font-medium leading-4 text-sand-50 sm:text-xs sm:leading-5">
                {image.caption}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-50/90 text-jungle-900 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Expand className="h-3.5 w-3.5" />
              </span>
            </span>
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-jungle-950/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Foto-galerij"
          onClick={close}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-50/20 bg-sand-50/10 text-sand-50 transition-colors hover:bg-sand-50 hover:text-jungle-950 sm:right-7 sm:top-7"
            aria-label="Galerij sluiten"
          >
            <Close className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sand-50/20 bg-sand-50/10 text-sand-50 transition-colors hover:bg-sand-50 hover:text-jungle-950 sm:left-7"
            aria-label="Vorige foto"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div
            className="w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl bg-jungle-900 sm:h-[75vh] sm:rounded-3xl">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-6">
              <div>
                <p className="font-display text-lg font-medium text-sand-50">
                  {activeImage.caption}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sand-300/70">
                  Foto {activeIndex + 1} van {images.length}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sand-50/20 bg-sand-50/10 text-sand-50 transition-colors hover:bg-sand-50 hover:text-jungle-950 sm:right-7"
            aria-label="Volgende foto"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </>
  );
}
