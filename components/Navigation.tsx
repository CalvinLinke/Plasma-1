"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

const leistungenLinks = [
  { href: "/leistungen/privatkunden", label: "Privatkunden" },
  { href: "/leistungen/gewerbekunden", label: "Gewerbekunden" },
  { href: "/leistungen/hausverwaltungen", label: "Hausverwaltungen" },
];

const navLinks = [
  { href: "/", label: "Startseite" },
  { href: "/ueber-uns", label: "Über Uns" },
  { href: "/partner-werden", label: "Partner werden" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leistungenOpen, setLeistungenOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setLeistungenOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setLeistungenOpen(false), 200);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isLeistungenActive = pathname.startsWith("/leistungen");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-ambient-md" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-transform duration-300 hover:scale-[1.03]"
        >
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
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                isLeistungenActive ? "text-violet-brand" : "text-marine hover:text-violet-brand"
              }`}
            >
              Leistungen
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${leistungenOpen ? "rotate-180" : ""}`}
              />
              {/* Active underline */}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-violet-brand rounded-full transition-transform duration-300 origin-left ${
                  isLeistungenActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-full left-0 mt-1 w-52 glass rounded-2xl shadow-ambient-md border border-white/20 py-2 transition-all duration-200 ${
                leistungenOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
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

          {navLinks.slice(1).map((link) => (
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
          <Link
            href="/angebot-erhalten"
            className="btn-primary text-sm"
            style={{ animationName: "pulse-ring" }}
          >
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden glass border-t border-white/20 overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Leistungen
          </p>
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
          {navLinks.slice(1).map((link) => (
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
