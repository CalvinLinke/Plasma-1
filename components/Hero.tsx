"use client";

import Link from "next/link";
import { TrendingDown, Clock, Shield, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 748, suffix: "", label: "Anschlüsse mit Ersparnis" },
  { value: 62, suffix: " €", label: "Ø Ersparnis / Jahr" },
  { value: 300, suffix: "+", label: "Zufriedene Kunden" },
  { value: 48, suffix: " Std.", label: "Bis zum Angebot" },
];

function useCountUp(target: number, duration = 1400, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

function StatNumber({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCountUp(value, 1400, active);
  return (
    <div className="text-center px-4">
      <p className="text-3xl font-bold text-marine tabular-nums">{count}{suffix}</p>
      <p className="text-xs text-gray-400 mt-1 leading-snug">{label}</p>
    </div>
  );
}

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: "linear-gradient(160deg, #ede9ff 0%, #ffffff 45%, #e5f8ff 100%)" }}
    >
      {/* Background: Farbwolken + SVG-Kreisbogen-Dekoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Farbwolken */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "700px", height: "600px", background: "radial-gradient(ellipse at center, rgba(123,97,255,0.18) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-8%", width: "750px", height: "550px", background: "radial-gradient(ellipse at center, rgba(0,240,255,0.13) 0%, transparent 70%)", borderRadius: "50%" }} />

        {/* SVG-Kreisbogen oben-rechts */}
        <svg
          style={{ position: "absolute", top: 0, right: 0, width: "700px", height: "700px", overflow: "visible" }}
          viewBox="0 0 700 700"
          fill="none"
        >
          <circle cx="700" cy="0" r="500" stroke="rgba(123,97,255,0.22)" strokeWidth="1.5" fill="none" />
          <circle cx="700" cy="0" r="380" stroke="rgba(123,97,255,0.14)" strokeWidth="1.5" fill="none" />
          <circle cx="700" cy="0" r="260" stroke="rgba(123,97,255,0.08)" strokeWidth="1" fill="none" />
        </svg>

        {/* SVG-Kreisbogen unten-links */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, width: "500px", height: "500px", overflow: "visible" }}
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="0" cy="500" r="380" stroke="rgba(0,240,255,0.18)" strokeWidth="1.5" fill="none" />
          <circle cx="0" cy="500" r="260" stroke="rgba(0,240,255,0.10)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">

          {/* Links: 60% */}
          <div className="lg:col-span-3 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "linear-gradient(135deg, #4B0082, #7B61FF)" }}>
              <span className="text-xs font-semibold uppercase tracking-widest text-white">
                Vertrauen in jeder Kilowattstunde
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Ihre Energie{" "}
              <span className="text-gradient block">in besten Händen.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
              Maximale Ersparnis bei Strom & Gas durch unabhängige Marktvergleiche — persönlich betreut, vollständig abgewickelt.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/angebot-erhalten" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
                Jetzt Angebot anfordern
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#prozess" className="btn-loader inline-flex items-center gap-2 text-base px-8 py-4">
                <span>Mehr erfahren</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Shield, text: "Kostenlos & unverbindlich" },
                { icon: Clock, text: "Angebot in 48 Stunden" },
                { icon: TrendingDown, text: "Ø 62 € Ersparnis/Jahr" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon className="w-4 h-4 text-violet-brand" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats — Consulting-Stil */}
            <div ref={statsRef} className="border-t border-gray-100 pt-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-gray-100">
                {stats.map((s) => (
                  <StatNumber key={s.label} value={s.value} suffix={s.suffix} label={s.label} active={statsActive} />
                ))}
              </div>
            </div>
          </div>

          {/* Rechts: 40% — Analyse-Karte */}
          <div className="lg:col-span-2 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">

              {/* Hauptkarte: Energieanalyse */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Karten-Header */}
                <div className="px-6 pt-6 pb-5" style={{ background: "linear-gradient(135deg, #4B0082 0%, #1A1B4B 100%)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Plasma Analyse</p>
                      <p className="text-white font-bold">Strom & Gas · 2025</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-white/50 text-xs mb-0.5">Aktueller Jahrestarif</p>
                    <p className="text-white text-3xl font-bold">1.580 €</p>
                    <p className="text-white/40 text-xs mt-0.5">vor Optimierung</p>
                  </div>
                </div>

                {/* Karten-Body */}
                <div className="px-6 py-5 space-y-4">

                  {/* Vergleichsbalken */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-400">Aktueller Vertrag</span>
                        <span className="text-xs font-semibold text-gray-500">1.580 €</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-red-200" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-400">Plasma-Tarif</span>
                        <span className="text-xs font-semibold text-marine">1.518 €</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "96%", background: "linear-gradient(90deg, #4B0082, #7B61FF)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Ersparnis-Badge */}
                  <div className="flex items-center gap-3 rounded-2xl p-3.5" style={{ backgroundColor: "rgba(22,163,74,0.07)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(22,163,74,0.12)" }}>
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ihre Ersparnis</p>
                      <p className="text-sm font-bold text-emerald-600">62 € / Jahr gespart</p>
                    </div>
                  </div>

                  {/* Statuszeile */}
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    <p className="text-xs text-gray-400">Analyse bereit · kostenlos & unverbindlich</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 1 — Kündigung übernommen */}
              <div
                className="absolute -left-10 top-14 glass rounded-2xl p-4 shadow-ambient-md animate-float border border-white/40"
                style={{ minWidth: "155px" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-500 font-medium">Erledigt</span>
                </div>
                <p className="text-sm font-bold text-marine leading-tight">Kündigung</p>
                <p className="text-xs text-gray-400">vom alten Vertrag</p>
              </div>

              {/* Floating Card 2 — Reaktionszeit */}
              <div
                className="absolute -right-8 bottom-14 glass rounded-2xl p-4 shadow-ambient-md animate-float-delayed border border-white/40"
                style={{ minWidth: "145px" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock className="w-4 h-4 text-violet-brand" />
                  <span className="text-xs text-gray-500 font-medium">Reaktionszeit</span>
                </div>
                <p className="text-2xl font-bold text-marine">48h</p>
                <p className="text-xs text-gray-400">bis zum Angebot</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
