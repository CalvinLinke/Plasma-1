import Link from "next/link";
import { BookOpen, Truck, Zap, ArrowRight } from "lucide-react";

const cards = [
  {
    href: "/ratgeber",
    icon: BookOpen,
    title: "Ratgeber",
    desc: "Anbieterwechsel, Grundversorgung, Abschlag, Ökostrom und mehr, verständlich erklärt.",
  },
  {
    href: "/wechseln",
    icon: Truck,
    title: "Umzug & Wechselanlässe",
    desc: "Strom und Gas beim Umzug richtig ummelden und direkt günstiger werden.",
  },
  {
    href: "/tarife",
    icon: Zap,
    title: "Tarife & Verträge",
    desc: "Ökostrom, Gas, Wärmepumpe, Gewerbestrom: die richtige Vertragsart finden.",
  },
];

export default function WissenTeaser() {
  return (
    <section className="section-spacing bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-brand">
            Wissen & Ratgeber
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-marine">
            Energie verstehen, clever sparen
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Unabhängige Ratgeber rund um Strom und Gas, damit Sie die richtigen Entscheidungen
            treffen und nicht zu viel zahlen.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-ambient card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-brand/10">
                <c.icon className="h-6 w-6 text-violet-brand" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-marine group-hover:text-violet-brand transition-colors">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{c.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-brand">
                Mehr erfahren
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
