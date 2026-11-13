const words = [
  "rijstvelden",
  "dolfijnen",
  "watervallen",
  "zonsopkomst",
  "kookles",
  "schildpadden",
  "surfles",
  "verkeerde afslagen",
  "koffie",
  "zonsondergang",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-jungle-900/10 bg-sunset-50 py-4">
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {words.map((word) => (
              <span
                key={`${copy}-${word}`}
                className="flex items-center gap-6 px-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-jungle-800 sm:text-xs"
              >
                {word}
                <span className="text-sunset-500" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
