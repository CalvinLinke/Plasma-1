import { Sparkles } from "lucide-react";

// AEO-Direktantwort: KI-zitierbarer Block ganz oben im Content. Kein JS (crawlbar).
export default function DirectAnswer({ frage, antwort }: { frage: string; antwort: string }) {
  return (
    <div className="rounded-3xl border border-violet-brand/20 bg-white shadow-ambient overflow-hidden">
      <div className="border-l-4 border-violet-brand p-6 md:p-7 bg-gradient-to-br from-violet-brand/[0.04] to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-brand/10">
            <Sparkles className="w-4 h-4 text-violet-brand" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-brand">
            Direkte Antwort
          </span>
        </div>
        <p className="text-lg font-bold text-marine mb-2 leading-snug">{frage}</p>
        <p className="text-[1.05rem] leading-relaxed text-gray-700">{antwort}</p>
      </div>
    </div>
  );
}
