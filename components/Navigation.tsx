"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

const leistungenLinks = [
  { href: "/leistungen/privatkunden", label: "Privatkunden" },
  { href: "/leistungen/gewerbekunden", label: "Gewerbekunden" },
  { href: "/leistungen/hausverwaltungen", label: "Hausverwaltungen" },
];

// Mega-Menü „Wissen": vier Silos mit den wichtigsten Unterseiten.
const wissenMega: {
  heading: string;
  href: string;
  desc: string;
  links: { href: string; label: string; download?: boolean }[];
}[] = [
  {
    heading: "Ratgeber",
    href: "/ratgeber",
    desc: "Strom & Gas verstehen",
    links: [
      { href: "/ratgeber/stromanbieter-wechseln", label: "Stromanbieter wechseln" },
      { href: "/ratgeber/grundversorgung-erklaert", label: "Grundversorgung erklärt" },
      { href: "/ratgeber/energiepreise-verstehen", label: "Energiepreise verstehen" },
      { href: "/ratgeber/strom-sparen-haushalt", label: "Strom sparen im Haushalt" },
    ],
  },
  {
    heading: "Umzug & Wechsel",
    href: "/wechseln",
    desc: "Der passende Anlass",
    links: [
      { href: "/wechseln/umzug-strom-gas-ummelden", label: "Umzug: Strom & Gas ummelden" },
      { href: "/wechseln/erste-eigene-wohnung-strom-anmelden", label: "Erste eigene Wohnung" },
      { href: "/wechseln/raus-aus-der-grundversorgung", label: "Raus aus der Grundversorgung" },
      { href: "/wechseln/preiserhoehung-anbieter-wechseln", label: "Preiserhöhung? Wechseln" },
    ],
  },
  {
    heading: "Tarife & Verträge",
    href: "/tarife",
    desc: "Die richtige Vertragsart",
    links: [
      { href: "/tarife/oekostrom", label: "Ökostrom" },
      { href: "/tarife/dynamische-stromtarife", label: "Dynamische Stromtarife" },
      { href: "/tarife/waermepumpenstrom", label: "Wärmepumpenstrom" },
      { href: "/tarife/gewerbestrom", label: "Gewerbestrom" },
    ],
  },
  {
    heading: "Vorlagen & Checklisten",
    href: "/vorlagen",
    desc: "Kostenlose Downloads",
    links: [
      { href: "/downloads/umzugs-checkliste-energie.html", label: "Umzugs-Checkliste", download: true },
      { href: "/downloads/kuendigung-strom-gas-vorlage.html", label: "Kündigungsvorlage", download: true },
      { href: "/downloads/widerspruch-preiserhoehung.html", label: "Widerspruch Preiserhöhung", download: true },
      { href: "/vorlagen", label: "Alle Vorlagen ansehen" },
    ],
  },
];

const navLinks = [
  { href: "/ueber-uns", label: "Über Uns" },
  { href: "/partner-werden", label: "Partner werden" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leistungenOpen, setLeistungenOpen] = useState(false);
  const [wissenOpen, setWissenOpen] = useState(false);
  const leistungenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wissenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const openLeistungen = () => {
    if (leistungenTimer.current) clearTimeout(leistungenTimer.current);
    setLeistungenOpen(true);
  };
  const closeLeistungen = () => {
    leistungenTimer.current = setTimeout(() => setLeistungenOpen(false), 200);
  };
  const openWissen = () => {
    if (wissenTimer.current) clearTimeout(wissenTimer.current);
    setWissenOpen(true);
  };
  const closeWissen = () => {
    wissenTimer.current = setTimeout(() => setWissenOpen(false), 200);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isLeistungenActive = pathname.startsWith("/leistungen");
  const isWissenActive =
    pathname.startsWith("/ratgeber") ||
    pathname.startsWith("/wechseln") ||
    pathname.startsWith("/tarife") ||
    pathname.startsWith("/vorlagen");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        wissenOpen ? "bg-white shadow-ambient-md" : scrolled ? "glass shadow-ambient-md" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-[1.03]">
          <Image
            src="/Logo Plasma.png"
            alt="Plasma Energie Solution"
            width={200}
            height={64}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Leistungen Dropdown */}
          <div className="relative" onMouseEnter={openLeistungen} onMouseLeave={closeLeistungen}>
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                isLeistungenActive ? "text-violet-brand" : "text-marine hover:text-violet-brand"
              }`}
            >
              Leistungen
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${leistungenOpen ? "rotate-180" : ""}`} />
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-violet-brand rounded-full transition-transform duration-300 origin-left ${
                  isLeistungenActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
            <div
              className={`absolute top-full left-0 mt-1 w-52 glass rounded-2xl shadow-ambient-md border border-white/20 py-2 transition-all duration-200 ${
                leistungenOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
              onMouseEnter={openLeistungen}
              onMouseLeave={closeLeistungen}
            >
              {leistungenLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 text-sm font-medium transition-colors duration-200 hover:text-violet-brand hover:bg-violet-brand/5 ${
                    isActive(link.href) ? "text-violet-brand" : "text-marine"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Wissen (Mega-Menü Trigger) */}
          <div onMouseEnter={openWissen} onMouseLeave={closeWissen}>
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                isWissenActive ? "text-violet-brand" : "text-marine hover:text-violet-brand"
              }`}
            >
              Wissen
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${wissenOpen ? "rotate-180" : ""}`} />
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-violet-brand rounded-full transition-transform duration-300 origin-left ${
                  isWissenActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                isActive(link.href) ? "text-violet-brand" : "text-marine hover:text-violet-brand"
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-violet-brand rounded-full transition-transform duration-300 origin-left ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="/angebot-erhalten" className="btn-primary text-sm" style={{ animationName: "pulse-ring" }}>
            Angebot anfordern
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-marine"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü öffnen"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Wissen Mega-Menü (Desktop, volle Breite) */}
      <div
        className={`hidden md:block absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-ambient-md transition-all duration-200 ${
          wissenOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        onMouseEnter={openWissen}
        onMouseLeave={closeWissen}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {wissenMega.map((col) => (
            <div key={col.href}>
              <Link href={col.href} className="group inline-flex items-center gap-1.5 text-marine hover:text-violet-brand transition-colors">
                <span className="text-sm font-bold uppercase tracking-wide">{col.heading}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-0.5 text-xs text-gray-400">{col.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {col.links.map((l) =>
                  l.download ? (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        download
                        className="block text-sm text-gray-600 hover:text-violet-brand transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} className="block text-sm text-gray-600 hover:text-violet-brand transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-gray-100 overflow-y-auto max-h-[calc(100vh-5rem)] transition-all duration-300 bg-white ${
          mobileOpen ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Leistungen</p>
          {leistungenLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-marine hover:bg-violet-brand/10 hover:text-violet-brand transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-gray-200 my-2" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Wissen</p>
          {wissenMega.map((col) => (
            <div key={col.href} className="mb-2">
              <Link
                href={col.href}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-marine hover:bg-violet-brand/10 hover:text-violet-brand transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {col.heading}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="pl-3">
                {col.links.map((l) =>
                  l.download ? (
                    <a
                      key={l.href}
                      href={l.href}
                      download
                      className="block px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-violet-brand/10 hover:text-violet-brand transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-violet-brand/10 hover:text-violet-brand transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}

          <div className="h-px bg-gray-200 my-2" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-marine hover:bg-violet-brand/10 hover:text-violet-brand transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/angebot-erhalten"
              className="block text-center btn-primary text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Angebot anfordern
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
