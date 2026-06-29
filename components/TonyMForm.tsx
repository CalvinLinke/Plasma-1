"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

// Co-Branding-Formular für die Variante-C-Landingpage (/tonym).
// Optik 1:1 aus dem Design-Handoff; Submit hängt an der bestehenden
// Upload-/Angebots-Logik (privater Blob-Store + /api/angebot) mit fester
// Partner-Zuordnung "tony" für die Provisionsabrechnung.

const MAX_MB = 25;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export default function TonyMForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "uploading" | "sending">("idle");
  const fileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setFileError(`Die Datei ist zu groß (max. ${MAX_MB} MB).`);
      fileRef.current = null;
      setFileName(null);
      return;
    }
    setFileError(null);
    fileRef.current = f;
    setFileName(f.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    // PLZ / Wohnort hat in der Angebots-API kein eigenes Feld — als
    // Anmerkung mitsenden, damit die Angabe nicht verloren geht.
    const plzOrt = (data.get("plzort") as string) || "";
    if (plzOrt) data.set("anmerkungen", `PLZ / Wohnort: ${plzOrt}`);

    try {
      const f = fileRef.current;
      if (f) {
        setPhase("uploading");
        const blob = await upload(f.name, f, {
          access: "private",
          handleUploadUrl: "/api/upload",
        });
        data.set("filePathname", blob.pathname);
        data.set("fileName", f.name);
        data.set("fileSize", String(f.size));
      }
      setPhase("sending");
      const res = await fetch("/api/angebot", { method: "POST", body: data });
      if (res.ok) {
        setSent(true);
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

  const handleReset = () => {
    setSent(false);
    setFileName(null);
    setFileError(null);
    fileRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  };

  const inputClass =
    "px-[14px] py-[12px] border border-[#e5e7eb] rounded-[11px] text-[14px] text-marine placeholder:text-gray-400";

  return (
    <div className="bg-white border border-[#eef] rounded-[24px] p-[26px] shadow-[0_10px_30px_rgba(0,0,0,.04)]">
      {sent ? (
        // Erfolgs-Zustand
        <div className="text-center px-[10px] py-[30px]">
          <div
            className="w-[58px] h-[58px] rounded-full inline-flex items-center justify-center mb-[14px]"
            style={{ background: "linear-gradient(135deg,#4B0082,#7B61FF)" }}
          >
            <svg width="29" height="29" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 6.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-[21px] font-bold text-marine mb-[6px]">Vielen Dank!</div>
          <div className="text-[14px] leading-[1.5] text-[#6b7280] max-w-[320px] mx-auto mb-[16px]">
            Wir prüfen Ihre Rechnung und melden uns innerhalb von 48 Stunden mit Ihrem persönlichen Angebot.
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-[20px] py-[10px] border border-[#e5e7eb] rounded-[11px] bg-white text-[#4B0082] text-[13px] font-semibold cursor-pointer transition-colors hover:bg-[#faf9ff]"
          >
            Weitere Anfrage
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="partner" value="tony" />

          {/* Upload-Dropzone */}
          <label className="block cursor-pointer">
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="border-2 border-dashed border-[#d9d4f5] rounded-[16px] p-[24px] text-center bg-[#faf9ff]">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[rgba(123,97,255,.12)] inline-flex items-center justify-center mb-[9px]">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V5m0 0L7.5 9.5M12 5l4.5 4.5" stroke="#7B61FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 17v1.5A2.5 2.5 0 007.5 21h9a2.5 2.5 0 002.5-2.5V17" stroke="#7B61FF" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              {fileName ? (
                <div className="text-[14px] font-semibold text-[#4B0082]">{fileName}</div>
              ) : (
                <div>
                  <div className="text-[15px] font-semibold text-marine">
                    Energierechnung ablegen oder <span className="text-[#7B61FF] underline">auswählen</span>
                  </div>
                  <div className="text-[12px] text-gray-400 mt-[3px]">PDF oder Foto · max. 25 MB</div>
                </div>
              )}
            </div>
          </label>
          {fileError && <p className="text-[12px] text-red-500 mt-2">{fileError}</p>}

          {/* Felder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[11px] mt-[15px]">
            <input name="vorname" required placeholder="Vorname" className={inputClass} />
            <input name="nachname" required placeholder="Nachname" className={inputClass} />
            <input type="email" name="email" required placeholder="E-Mail" className={inputClass} />
            <input type="tel" name="telefon" placeholder="Telefon" className={inputClass} />
            <input name="plzort" required placeholder="PLZ / Wohnort" className={`${inputClass} sm:col-span-2`} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-[15px] py-[15px] border-none rounded-[12px] bg-[#7B61FF] text-white text-[16px] font-semibold cursor-pointer shadow-[0_8px_20px_rgba(123,97,255,.32)] transition-colors hover:bg-[#6a4fef] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? phase === "uploading"
                ? "Rechnung wird hochgeladen…"
                : "Wird gesendet…"
              : "Kostenlos Angebot anfordern"}
          </button>

          <div className="text-[11.5px] text-gray-400 text-center mt-[11px] leading-relaxed">
            Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{" "}
            <a href="/datenschutz" className="text-[#7B61FF] hover:underline">
              Datenschutzerklärung
            </a>{" "}
            zu. Keine Weitergabe an Dritte · Vermittelt durch tonyM Versicherungsmakler
          </div>
        </form>
      )}
    </div>
  );
}
