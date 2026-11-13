import Link from "next/link";

import { ArrowLeft, ArrowUpRight, Compass } from "@/components/icons";
import { MonkeyMark } from "@/components/monkey-mark";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-28">
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-sunset-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-xl">
        <MonkeyMark size={76} className="mx-auto animate-float" />
        <p className="mt-8 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.19em] text-sunset-700">
          <Compass className="h-4 w-4" />
          Foutje in de kaart
        </p>
        <h1 className="mt-4 font-display text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.05em] text-jungle-950 sm:text-[4.5rem]">
          Deze weg loopt{" "}
          <span className="italic text-sunset-600">dood.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[1.01rem] leading-8 text-jungle-800/80">
          De pagina die je zoekt bestaat niet, is verplaatst of ligt achter een
          verkeerde afslag. Dat overkomt de beste reizigers.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="button-primary">
            <ArrowLeft className="h-4 w-4" />
            Terug naar de homepage
          </Link>
          <Link href="/reizen" className="button-secondary">
            Bekijk de routes
            <ArrowUpRight className="h-4 w-4 text-sunset-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}
