"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent, resetConsent, CONSENT_EVENT, type ConsentValue } from "@/lib/consent";

// Kleines, CI-konformes Cookie-/Consent-Banner. Erscheint nur, solange noch
// keine Entscheidung getroffen wurde (oder nach Widerruf). Steuert das Laden
// externer Inhalte wie Google Maps.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(getConsent() === null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!visible) return null;

  const choose = (value: ConsentValue) => setConsent(value);

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-4 shadow-ambient-md sm:left-auto sm:right-4 sm:mx-0"
    >
      <p className="mb-1 text-sm font-semibold text-marine">Cookies &amp; externe Inhalte</p>
      <p className="mb-3 text-xs leading-relaxed text-gray-500">
        Wir verwenden nur technisch notwendige Cookies. Externe Inhalte wie Google Maps werden erst
        nach Ihrer Zustimmung geladen — dabei werden Daten an Google übertragen. Details in der{" "}
        <Link href="/datenschutz" className="text-violet-brand underline">
          Datenschutzerklärung
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose("all")}
          className="flex-1 rounded-xl bg-[#7B61FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6a4fef]"
        >
          Akzeptieren
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-marine transition-colors hover:bg-gray-50"
        >
          Nur notwendige
        </button>
      </div>
    </div>
  );
}

// Button zum Widerruf/Ändern der Einwilligung — für die Datenschutzseite.
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => resetConsent()}
      className="mt-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-marine transition-colors hover:bg-gray-50"
    >
      Cookie-Einstellungen ändern
    </button>
  );
}
