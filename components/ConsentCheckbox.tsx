"use client";

import Link from "next/link";
import { useId } from "react";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Ergänzt den Einwilligungstext um die hochgeladene Energierechnung (Upload-Formulare). */
  mitUpload?: boolean;
  /** Optionaler Zusatzhinweis, z. B. zur Partnervermittlung. */
  zusatz?: string;
  className?: string;
};

/**
 * Zentrale DSGVO-Einwilligungs-Checkbox für alle datenerhebenden Formulare.
 * Der Einwilligungstext steht bewusst nur hier — eine Quelle, keine abweichenden
 * Formulierungen. Opt-in (nicht vorausgewählt) und `required`, damit ohne Häkchen
 * nicht abgesendet werden kann (Constraint-Validation läuft vor dem Submit-Handler).
 */
export default function ConsentCheckbox({
  checked,
  onChange,
  mitUpload = false,
  zusatz,
  className = "",
}: ConsentCheckboxProps) {
  const id = useId();
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-gray-200 bg-surface p-4 ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        name="datenschutz"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-violet-brand"
      />
      <label htmlFor={id} className="cursor-pointer text-xs leading-relaxed text-gray-500">
        Ich habe die{" "}
        <Link
          href="/datenschutz"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-violet-brand hover:underline"
        >
          Datenschutzerklärung
        </Link>{" "}
        gelesen und willige ein, dass Plasma Energie Solution meine übermittelten Daten
        {mitUpload ? " und die hochgeladene Energierechnung" : ""} zur Bearbeitung meiner
        Anfrage und zur Erstellung eines individuellen Angebots verarbeitet. Diese
        Einwilligung kann ich jederzeit mit Wirkung für die Zukunft widerrufen.
        {zusatz ? <span className="mt-1 block text-gray-400">{zusatz}</span> : null}
      </label>
    </div>
  );
}
