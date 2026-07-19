"use client";

import { useRef } from "react";

const testimonials = [
  {
    text: "Ich hab ehrlich gesagt nicht viel erwartet, aber nach zwei Tagen lag ein Angebot im Postfach, das günstiger war als alles was ich selbst gefunden hatte. Und den Wechsel haben die einfach komplett übernommen.",
    name: "Michael K.",
    city: "München",
    savings: "78 €/Jahr gespart",
  },
  {
    text: "Nach der letzten Abrechnung dachte ich, ich muss da selbst was tun. Hab die Rechnung hochgeladen, kurz telefoniert, und irgendwann kam die Bestätigung, dass alles erledigt ist. Ich hab buchstäblich nichts gemacht.",
    name: "Sandra L.",
    city: "Hamburg",
    savings: "54 €/Jahr gespart",
  },
  {
    text: "Wir verwalten mehrere Liegenschaften und hatten das Thema Energie immer wieder auf dem Tisch. Plasma hat das für drei Objekte auf einmal geregelt. Kein Hin und Her, kein Papierchaos.",
    name: "Thomas B.",
    city: "Berlin",
    savings: "3 Liegenschaften",
  },
  {
    text: "Ich hab vorher auf jedem Portal nachgeschaut, irgendwie war da nie wirklich jemand. Hier hat sich tatsächlich jemand die Zeit genommen und mir erklärt, was wie warum besser ist. Das war anders.",
    name: "Anna M.",
    city: "Frankfurt",
    savings: "62 €/Jahr gespart",
  },
  {
    text: "Als Betrieb willst du einfach wissen, was dich Energie kostet, ohne dass sich das jeden Monat ändert. Jetzt haben wir einen festen Tarif, einen Ansprechpartner und keine bösen Überraschungen mehr.",
    name: "Robert S.",
    city: "Köln",
    savings: "Gewerbekunde",
  },
  {
    text: "War am Anfang skeptisch, ob das wirklich kostenlos ist. Ist es. Und das Angebot war besser als mein aktueller Vertrag. Hätte ich früher machen sollen.",
    name: "Julia W.",
    city: "Stuttgart",
    savings: "91 €/Jahr gespart",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-surface py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Was unsere Kunden sagen
        </p>
      </div>

      {/* Marquee track */}
      <div
        className="relative"
        onMouseEnter={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
        }}
        onMouseLeave={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "running";
        }}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #F8FAFC, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #F8FAFC, transparent)" }} />

        <div
          ref={trackRef}
          className="flex gap-4 animate-marquee"
          style={{ width: "max-content" }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-ambient border border-gray-100 shrink-0 w-64 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ambient-md"
            >
              <StarRating />
              <p className="text-xs text-gray-600 leading-relaxed mt-2 mb-3">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-marine">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.city}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(123,97,255,0.1)", color: "#7B61FF" }}
                >
                  {t.savings}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
