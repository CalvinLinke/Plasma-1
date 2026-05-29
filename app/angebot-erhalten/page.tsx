"use client";

import { useState, useRef } from "react";
import { Upload, Shield, Clock, CheckCircle, File, X } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "Kostenlos", sub: "Keine versteckten Gebühren" },
  { icon: CheckCircle, label: "Unverbindlich", sub: "Kein Vertragszwang" },
  { icon: Clock, label: "48h Antwort", sub: "Schnelle Rückmeldung" },
];

export default function AngebotErhalten() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type.startsWith("image/") || f.type === "application/pdf") {
      setFile(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    if (file) data.set("file", file, file.name);
    try {
      const res = await fetch("/api/angebot", { method: "POST", body: data });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.");
      }
    } catch {
      alert("Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16 px-4">
        <div className="max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #4B0082, #7B61FF)" }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-marine mb-3">Vielen Dank!</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Wir haben Ihre Anfrage erhalten und melden uns innerhalb von{" "}
            <strong className="text-marine">48 Stunden</strong> mit einem persönlichen Angebot.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary px-8 py-3"
          >
            Weitere Anfrage stellen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">
            Schritt 1 von 1
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-marine mb-4">
            Sie laden Ihre Rechnung hoch –{" "}
            <span className="text-gradient">wir erledigen den Rest.</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Kostenlos. Unverbindlich. In unter 2 Minuten ausgefüllt.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {trustBadges.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-ambient"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-brand/10 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-violet-brand" />
              </div>
              <p className="text-sm font-semibold text-marine">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-ambient border border-gray-100 space-y-6"
        >
          {/* Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-marine mb-3">
              Energierechnung hochladen
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragging
                  ? "border-cyan-brand bg-cyan-brand/5"
                  : file
                  ? "border-violet-brand bg-violet-brand/5"
                  : "border-gray-200 hover:border-violet-brand/50 hover:bg-violet-brand/3"
              }`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <File className="w-8 h-8 text-violet-brand" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-marine">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors duration-300 ${dragging ? "text-cyan-brand" : "text-gray-300"}`} />
                  <p className="text-sm font-medium text-marine">
                    Datei hier ablegen oder{" "}
                    <span className="text-violet-brand underline">auswählen</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF oder Bild (JPG, PNG) · Max. 10 MB</p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-marine mb-2">Vorname *</label>
              <input
                type="text"
                name="vorname"
                required
                placeholder="Max"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-marine placeholder-gray-300 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-marine mb-2">Nachname *</label>
              <input
                type="text"
                name="nachname"
                required
                placeholder="Mustermann"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-marine placeholder-gray-300 transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-marine mb-2">E-Mail *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="max@beispiel.de"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-marine placeholder-gray-300 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-marine mb-2">Telefon</label>
              <input
                type="tel"
                name="telefon"
                placeholder="+49 123 456 789"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-marine placeholder-gray-300 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-marine mb-2">
              Anmerkungen (optional)
            </label>
            <textarea
              rows={3}
              name="anmerkungen"
              placeholder="z.B. Ich bin Gewerbekunde und möchte mehrere Anschlüsse optimieren..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-marine placeholder-gray-300 transition-all duration-300 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Wird gesendet…
              </>
            ) : (
              <>
                Kostenlos Angebot anfordern
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Mit dem Absenden stimmen Sie unserer{" "}
            <a href="/datenschutz" className="text-violet-brand hover:underline">Datenschutzerklärung</a>{" "}
            zu. Keine Weitergabe an Dritte.
          </p>
        </form>
      </div>
    </div>
  );
}
