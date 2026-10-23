"use client";

import { useRouter, usePathname } from "next/navigation";
import { FLAGGEN, SPRACHEN, TEXTE, mitSprache, type Sprache } from "@/lib/prototyp-texte";

export default function Sprachwahl({ sprache }: { sprache: Sprache }) {
  const router = useRouter();
  const pathname = usePathname();

  function waehle(naechste: Sprache) {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) params.set("next", mitSprache(next, naechste));
    if (naechste === "de") params.delete("lang");
    else params.set("lang", naechste);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="mt-5 grid grid-cols-4 gap-2" role="group" aria-label={TEXTE[sprache].spracheAuswahl}>
      {SPRACHEN.map((id) => {
        const aktiv = id === sprache;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={aktiv}
            onClick={() => waehle(id)}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-1 py-2 text-[11px] leading-tight ${
              aktiv ? "border-violet-brand bg-white text-marine" : "border-[#e6e8ef] bg-white text-[#5c6178]"
            }`}
          >
            <span className="text-xl leading-none" aria-hidden="true">{FLAGGEN[id]}</span>
            {TEXTE[id].spracheName}
          </button>
        );
      })}
    </div>
  );
}
