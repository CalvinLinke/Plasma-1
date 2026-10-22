import type { Metadata } from "next";
import Image from "next/image";
import { sichereWeiterleitung } from "@/lib/prototyp-gate";

export const metadata: Metadata = {
  title: "Zugang",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PrototypZugang({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const roh = params.next;
  const next = sichereWeiterleitung(Array.isArray(roh) ? roh[0] : roh);
  const fehler = params.fehler === "1" || (Array.isArray(params.fehler) && params.fehler.includes("1"));

  return (
    <div className="min-h-dvh bg-surface text-marine">
      <p className="bg-marine px-4 py-2 text-center text-xs text-white">Prototyp · Zugang mit Passwort</p>
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <Image
          src="/Logo Plasma.png"
          alt="Plasma Energie Solution"
          width={200}
          height={64}
          className="h-10 w-auto object-contain"
          priority
        />
        <form className="mt-8" method="post" action="/api/prototyp-zugang">
          <h1 className="text-3xl font-medium leading-tight">Geschützter Entwurf.</h1>
          <p className="mt-3 text-base leading-relaxed text-[#5c6178]">
            Dieser Prototyp ist mit einem Passwort geschützt.
          </p>
          <input type="hidden" name="next" value={next} />
          <label className="mt-8 block">
            <span className="mb-1.5 block text-sm font-medium">Passwort</span>
            <input
              className="w-full rounded-xl border border-[#e6e8ef] bg-white px-4 py-3 text-base text-marine outline-none focus:border-violet-brand"
              type="password"
              name="passwort"
              autoComplete="current-password"
              required
            />
          </label>
          {fehler ? <p className="mt-3 text-sm text-red-700">Das Passwort stimmt nicht.</p> : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white"
          >
            Öffnen
          </button>
        </form>
      </div>
    </div>
  );
}
