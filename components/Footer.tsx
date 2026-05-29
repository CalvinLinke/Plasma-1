import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const leistungenLinks = [
  { href: "/leistungen/privatkunden", label: "Privatkunden" },
  { href: "/leistungen/gewerbekunden", label: "Gewerbekunden" },
  { href: "/leistungen/hausverwaltungen", label: "Hausverwaltungen" },
];

const companyLinks = [
  { href: "/ueber-uns", label: "Über Uns" },
  { href: "/partner-werden", label: "Partner werden" },
  { href: "/angebot-erhalten", label: "Angebot erhalten" },
  { href: "/kontakt", label: "Kontakt" },
];

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A0B1E" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Logo + Slogan */}
          <div className="space-y-20">
            <Link href="/">
              <Image
                src="/Logo Plasma.png"
                alt="Plasma Energie Solution"
                width={130}
                height={44}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Energieverträge optimiert – persönlich statt anonym. Ihr unabhängiger Partner für Strom und Gas.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Unternehmen
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Leistungen */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Leistungen
            </h4>
            <ul className="space-y-2.5">
              {leistungenLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Kontakt */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-violet-brand shrink-0" />
                <span>box@plasma-energie.de</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-violet-brand shrink-0" />
                <span>+49 172 8182583</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-violet-brand shrink-0 mt-0.5" />
                <span>Grüne Straße 13b, 01067 Dresden</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2025 Plasma Energie Solution. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
