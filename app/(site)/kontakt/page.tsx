"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, CheckCircle, ChevronDown } from "lucide-react";
import ContactMap from "@/components/ContactMap";
import ConsentCheckbox from "@/components/ConsentCheckbox";

const contactReasons = [
  "Allgemeine Anfrage",
  "Angebot anfragen",
  "Partner werden",
  "Hausverwaltung",
  "Feedback",
];

export default function Kontakt() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      vorname: (form.elements.namedItem("vorname") as HTMLInputElement)?.value || "",
      nachname: (form.elements.namedItem("nachname") as HTMLInputElement)?.value || "",
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value || "",
      nachricht: (form.elements.namedItem("nachricht") as HTMLTextAreaElement)?.value || "",
      grund: reason,
      datenschutz: consent,
    };
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Fehler beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.");
      }
    } catch {
      alert("Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white relative overflow-hidden">

      {/* Dekoration oben-rechts — identisch Hero */}
      <div className="absolute top-0 right-0 pointer-events-none" aria-hidden>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "700px", height: "600px", background: "radial-gradient(ellipse at center, rgba(123,97,255,0.18) 0%, transparent 70%)", borderRadius: "50%" }} />
        <svg
          style={{ position: "absolute", top: 0, right: 0, width: "700px", height: "700px", overflow: "visible" }}
          viewBox="0 0 700 700"
          fill="none"
        >
          <circle cx="700" cy="0" r="500" stroke="rgba(123,97,255,0.22)" strokeWidth="1.5" fill="none" />
          <circle cx="700" cy="0" r="380" stroke="rgba(123,97,255,0.14)" strokeWidth="1.5" fill="none" />
          <circle cx="700" cy="0" r="260" stroke="rgba(123,97,255,0.08)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Dekoration unten-links — Farbblob + Kreisbögen (identisch Hero) */}
      <div className="absolute bottom-0 left-0 pointer-events-none" aria-hidden>
        {/* Farbwolken */}
        <div style={{ position: "absolute", bottom: "-5%", left: "-8%", width: "750px", height: "550px", background: "radial-gradient(ellipse at center, rgba(0,240,255,0.23) 0%, transparent 65%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-2%", left: "-4%", width: "500px", height: "400px", background: "radial-gradient(ellipse at center, rgba(123,97,255,0.13) 0%, transparent 65%)", borderRadius: "50%" }} />
        {/* Kreisbögen */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, width: "500px", height: "500px", overflow: "visible" }}
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="0" cy="500" r="380" stroke="rgba(0,240,255,0.22)" strokeWidth="1.5" fill="none" />
          <circle cx="0" cy="500" r="260" stroke="rgba(0,240,255,0.14)" strokeWidth="1.5" fill="none" />
          <circle cx="0" cy="500" r="160" stroke="rgba(123,97,255,0.10)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">Kontakt</p>
          <h1 className="text-5xl font-bold text-marine mb-5">Wir sind für Sie da.</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Frage, Feedback oder direkter Gesprächswunsch — schreiben Sie uns.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Formular — mobil zuerst */}
          <div className="order-1 lg:order-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-surface rounded-3xl border border-gray-100">
                <CheckCircle className="w-14 h-14 text-violet-brand mb-4" />
                <h2 className="text-xl font-bold text-marine mb-2">Nachricht erhalten!</h2>
                <p className="text-gray-500 text-sm">Wir melden uns innerhalb von 48 Stunden bei Ihnen.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface rounded-3xl p-8 border border-gray-100 space-y-4">

                {/* Grund der Kontaktaufnahme — Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <label className="block text-sm font-semibold text-marine mb-2">
                    Grund der Kontaktaufnahme
                  </label>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-all duration-200"
                    style={{
                      borderColor: dropdownOpen ? "#7B61FF" : "#E5E7EB",
                      backgroundColor: "white",
                      color: reason ? "#1A1B4B" : "#9CA3AF",
                    }}
                  >
                    <span>{reason || "Bitte wählen…"}</span>
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{ color: "#9CA3AF", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-ambient-md overflow-hidden">
                      {contactReasons.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => { setReason(r); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3"
                          style={{
                            backgroundColor: reason === r ? "rgba(123,97,255,0.08)" : "white",
                            color: reason === r ? "#7B61FF" : "#374151",
                            fontWeight: reason === r ? 600 : 400,
                          }}
                        >
                          {reason === r && <CheckCircle className="w-4 h-4 text-violet-brand shrink-0" />}
                          {reason !== r && <span className="w-4 h-4 shrink-0" />}
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-marine mb-2">Vorname *</label>
                    <input
                      type="text"
                      name="vorname"
                      required
                      placeholder="Max"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-marine placeholder-gray-300 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-marine mb-2">Nachname *</label>
                    <input
                      type="text"
                      name="nachname"
                      required
                      placeholder="Mustermann"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-marine placeholder-gray-300 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-marine mb-2">E-Mail *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="max@beispiel.de"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-marine placeholder-gray-300 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-marine mb-2">Nachricht *</label>
                  <textarea
                    rows={4}
                    name="nachricht"
                    required
                    placeholder="Ihr Anliegen..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-marine placeholder-gray-300 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Datenschutz-Einwilligung — Pflicht (Opt-in) */}
                <ConsentCheckbox checked={consent} onChange={setConsent} />

                <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Wird gesendet…
                    </>
                  ) : "Nachricht senden"}
                </button>
              </form>
            )}
          </div>

          {/* Kontaktdaten — mobil nach dem Formular */}
          <div className="order-2 lg:order-1 space-y-4">
            {[
              { icon: Mail, title: "E-Mail", value: "box@plasma-energie.de", sub: "Wir antworten innerhalb von 48 Stunden" },
              { icon: Phone, title: "Telefon", value: "+49 172 8182583", sub: "Mo–Fr, 9–17 Uhr" },
              { icon: MapPin, title: "Adresse", value: "Grüne Straße 13b", sub: "01067 Dresden" },
            ].map(({ icon: Icon, title, value, sub }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 shadow-ambient bg-white card-hover">
                <div className="w-12 h-12 rounded-xl bg-violet-brand/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-violet-brand" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{title}</p>
                  <p className="font-bold text-marine">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Google Maps — lädt erst nach Einwilligung (Click-to-load) */}
            <ContactMap />
          </div>

        </div>
      </div>
    </div>
  );
}
