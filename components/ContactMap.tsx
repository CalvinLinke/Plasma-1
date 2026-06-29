"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, CONSENT_EVENT } from "@/lib/consent";

// Google-Maps-Einbettung mit „Click-to-load": Die Karte (und damit der
// Datentransfer an Google) lädt erst, wenn der Nutzer zugestimmt hat —
// entweder über das Consent-Banner oder per Klick auf „Karte laden".
export default function ContactMap() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(getConsent() === "all");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-ambient">
      {allowed ? (
        <iframe
          src="https://maps.google.com/maps?q=Gr%C3%BCne+Stra%C3%9Fe+13b%2C+01067+Dresden&hl=de&z=16&output=embed"
          width="100%"
          height="240"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Plasma Energie Solution – Standort Dresden"
        />
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-3 bg-surface px-6 py-10 text-center"
          style={{ minHeight: 240 }}
        >
          <p className="max-w-sm text-sm text-gray-500">
            Aus Datenschutzgründen wird die Google-Maps-Karte erst nach Ihrer Zustimmung geladen.
            Dabei werden Daten (u. a. Ihre IP-Adresse) an Google übertragen.
          </p>
          <button
            type="button"
            onClick={() => setConsent("all")}
            className="rounded-xl bg-[#7B61FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6a4fef]"
          >
            Karte laden
          </button>
        </div>
      )}
    </div>
  );
}
