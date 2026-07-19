import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldCheck } from "lucide-react";
import { company, siteConfig } from "@/lib/site";

// Marken-Autorenbox (E-E-A-T). Inhalte firmieren unter der Marke, nicht unter Person.
export default function AuthorBox() {
  return (
    <aside className="rounded-3xl border border-gray-100 bg-white shadow-ambient p-6 md:p-7">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
        <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-gradient p-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={120}
            height={120}
            className="w-full h-auto object-contain"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand">
            Über den Autor
          </p>
          <p className="mt-1 text-lg font-bold text-marine">{siteConfig.name}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-violet-brand" /> Unabhängiger Energievermittler
            </span>
            <span className="text-gray-300">·</span>
            <span>§34c GewO</span>
            <span className="text-gray-300">·</span>
            <span>{company.address.city}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {siteConfig.description} Wir prüfen Strom- und Gasverträge individuell und begleiten den
            Wechsel persönlich, kostenlos und unverbindlich.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={company.phone.href}
              className="inline-flex items-center gap-1.5 font-medium text-violet-brand hover:text-indigo transition-colors"
            >
              <Phone className="w-4 h-4" /> {company.phone.display}
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-1.5 font-medium text-marine hover:text-violet-brand transition-colors"
            >
              Kontakt aufnehmen →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
