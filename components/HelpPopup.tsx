"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Phone, X, ArrowRight } from "lucide-react";

const PHONE_DISPLAY = "+49 172 8182583";
const PHONE_LINK = "tel:+491728182583";
const DELAY_MS = 60 * 1000; // nach 1 Minute
const STORAGE_KEY = "plasma_help_dismissed";

export default function HelpPopup() {
  const [render, setRender] = useState(false); // im DOM?
  const [shown, setShown] = useState(false); // Einblend-Animation

  useEffect(() => {
    // In dieser Sitzung schon weggeklickt? Dann nicht erneut zeigen.
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setRender(true);
      // im nächsten Frame einblenden (für die Transition)
      requestAnimationFrame(() => setShown(true));
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShown(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setRender(false), 300);
  };

  if (!render) return null;

  return (
    <div
      className={`fixed z-50 bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 sm:max-w-sm transition-all duration-300 ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      role="dialog"
      aria-label="Haben Sie Fragen?"
    >
      <div className="relative bg-white rounded-3xl shadow-ambient-md border border-gray-100 p-6 overflow-hidden">
        {/* dezenter CI-Glow oben rechts */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl"
          style={{ background: "radial-gradient(circle, #7B61FF, transparent 70%)" }}
        />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Schließen"
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #4B0082, #7B61FF)" }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-lg font-bold text-marine mb-1.5">Haben Sie Fragen?</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          Wir helfen Ihnen gern weiter, persönlich und unverbindlich. Schreiben Sie uns oder rufen Sie direkt an.
        </p>

        <div className="space-y-2.5">
          <Link
            href="/kontakt"
            onClick={dismiss}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
          >
            Zum Kontaktformular
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={PHONE_LINK}
            className="btn-ghost w-full py-3 flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>{PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
