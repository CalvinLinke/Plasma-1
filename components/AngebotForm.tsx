"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, Shield, Clock, CheckCircle, File, X } from "lucide-react";
import ConsentCheckbox from "@/components/ConsentCheckbox";

const trustBadges = [
  { icon: Shield, label: "Kostenlos", sub: "Keine versteckten Gebühren" },
  { icon: CheckCircle, label: "Unverbindlich", sub: "Kein Vertragszwang" },
  { icon: Clock, label: "48h Antwort", sub: "Schnelle Rückmeldung" },
];

const MAX_MB = 25;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

type AngebotFormProps = {
  /**
   * Partner-Slug (z. B. "tony"). Wird vom Server gesetzt und als verstecktes
   * Feld mitgesendet — so ist die Provisionszuordnung clientseitig nicht
   * manipulierbar. Ohne Slug verhält sich das Formular wie das Standard-Formular.
   */
  partnerSlug?: string;
};

export default function AngebotForm({ partnerSlug }: AngebotFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "uploading" | "sending">("idle");
  const [consent, setConsent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError("Bitte laden Sie eine PDF oder ein Bild (JPG, PNG) hoch.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError(
        `Die Datei ist zu groß (${(f.size / 1024 / 1024).toFixed(1)} MB). Maximal ${MAX_MB} MB.`,
      );
      return;
    }
    setFileError(null);
    setFile(f);
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
    try {
      // Schritt 1: Datei direkt in den privaten Blob-Store laden (umgeht 4,5-MB-Limit).
      if (file) {
        setPhase("uploading");
        const blob = await upload(file.name, file, {
          access: "private",
          handleUploadUrl: "/api/upload",
        });
        data.set("filePathname", blob.pathname);
        data.set("fileName", file.name);
        data.set("fileSize", String(file.size));
      }
      // Schritt 2: nur die Felder + den Blob-Pfad an die API (winziger Request).
      setPhase("sending");
      const res = await fetch("/api/angebot", { method: "POST", body: data });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.");
      }
    } catch {
      alert("Verbindungsfehler oder Datei-Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
      setPhase("idle");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md w-full text-center mx-auto">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #4B0082, #7B61FF)" }}
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-marine mb-3">Vielen Dank!</h2>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Wir haben Ihre Anfrage erhalten und melden uns innerhalb von{" "}
          <strong className="text-marine">48 Stunden</strong> mit einem persönlichen Angebot.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-primary px-8 py-3">
          Weitere Anfrage stellen
        </button>
      </div>
    );
  }

  return (
    <>
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
        {/* Partner-Kennung — server-seitig gesetzt, für die Provisionszuordnung */}
        {partnerSlug && <input type="hidden" name="partner" value={partnerSlug} />}

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
              accept=".pdf,image/jpeg,image/png"
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
                  onClick={(e) => { e.stopPropagation(); setFile(null); setFileError(null); }}
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
                <p className="text-xs text-gray-400 mt-1">PDF oder Bild (JPG, PNG) · Max. {MAX_MB} MB</p>
              </>
            )}
          </div>
          {fileError && (
            <p className="text-xs text-red-500 mt-2">{fileError}</p>
          )}
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

        {/* Datenschutz-Einwilligung — Pflicht (Opt-in) */}
        <ConsentCheckbox mitUpload checked={consent} onChange={setConsent} />

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
              {phase === "uploading" ? "Rechnung wird hochgeladen…" : "Wird gesendet…"}
            </>
          ) : (
            <>
              Kostenlos Angebot anfordern
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Kostenlos &amp; unverbindlich · Keine Weitergabe an Dritte ohne Ihre ausdrückliche Zustimmung.
        </p>
      </form>
    </>
  );
}
