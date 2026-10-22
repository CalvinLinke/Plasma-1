"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  HAUSHALTE,
  PROTOTYP_MIN_PROVISION_EUR,
  auftragEntwurf,
  waehleTarif,
  type AuftragPerson,
  type Tarifwahl,
} from "@/lib/prototyp-wechsel";

type Step = "angaben" | "angebot" | "person" | "konto" | "fertig";

const STEPS: Step[] = ["angaben", "angebot", "person", "konto"];

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const ct = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kwhFmt = new Intl.NumberFormat("de-DE");

const inputClass =
  "w-full rounded-xl border border-[#e6e8ef] bg-white px-4 py-3 text-base text-marine outline-none focus:border-violet-brand";

type Person = AuftragPerson & { datenschutz: boolean };

const LEERE_PERSON: Person = {
  anrede: "",
  vorname: "",
  nachname: "",
  geburtstag: "",
  email: "",
  telefon: "",
  strasse: "",
  hausnummer: "",
  plz: "",
  ort: "",
  zaehlernummer: "",
  vorversorger: "",
  iban: "",
  kontoinhaber: "",
  datenschutz: false,
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marine">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

function volljaehrig(iso: string): boolean {
  const geboren = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(geboren.getTime())) return false;
  const grenze = new Date();
  grenze.setFullYear(grenze.getFullYear() - 18);
  return geboren <= grenze;
}

export default function WechselFlow({ campaignCode }: { campaignCode: string }) {
  const [step, setStep] = useState<Step>("angaben");
  const [sucht, setSucht] = useState(false);
  const [plz, setPlz] = useState("");
  const [haushalt, setHaushalt] = useState<string>("");
  const [kwhEingabe, setKwhEingabe] = useState("");
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const [schwelle, setSchwelle] = useState(PROTOTYP_MIN_PROVISION_EUR);
  const [person, setPerson] = useState<Person>(LEERE_PERSON);
  const [rechnungHinweis, setRechnungHinweis] = useState("");
  const [auftrag, setAuftrag] = useState<Record<string, string> | null>(null);
  const [festgehalten, setFestgehalten] = useState<Tarifwahl | null>(null);
  const sucheTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (sucheTimer.current) window.clearTimeout(sucheTimer.current);
    };
  }, []);

  const verbrauchKwh = useMemo(() => {
    const getippt = Number(kwhEingabe.replace(/\./g, "").replace(",", "."));
    if (kwhEingabe.trim() && Number.isFinite(getippt)) return Math.round(getippt);
    return HAUSHALTE.find((eintrag) => eintrag.id === haushalt)?.kwh ?? 0;
  }, [haushalt, kwhEingabe]);

  const wahl = useMemo(() => waehleTarif(verbrauchKwh || 2500, schwelle), [verbrauchKwh, schwelle]);
  const angebot = step === "angebot" || sucht ? wahl : festgehalten ?? wahl;

  function set<K extends keyof Person>(key: K, value: Person[K]) {
    setPerson((aktuell) => ({ ...aktuell, [key]: value }));
    setFehler((aktuell) => {
      if (!aktuell[key]) return aktuell;
      const naechstes = { ...aktuell };
      delete naechstes[key];
      return naechstes;
    });
  }

  function angabenPruefen(): boolean {
    const naechstes: Record<string, string> = {};
    if (!/^\d{5}$/.test(plz)) naechstes.plz = "Bitte eine PLZ mit 5 Ziffern.";
    if (verbrauchKwh < 500 || verbrauchKwh > 50000) {
      naechstes.verbrauch = "Bitte Haushalt wählen oder den Verbrauch zwischen 500 und 50.000 kWh angeben.";
    }
    setFehler(naechstes);
    return Object.keys(naechstes).length === 0;
  }

  function zumAngebot() {
    if (!angabenPruefen()) return;
    setSucht(true);
    if (sucheTimer.current) window.clearTimeout(sucheTimer.current);
    sucheTimer.current = window.setTimeout(() => {
      setSucht(false);
      setStep("angebot");
    }, 600);
  }

  function personPruefen(): boolean {
    const naechstes: Record<string, string> = {};
    if (!person.anrede) naechstes.anrede = "Bitte eine Anrede wählen.";
    if (person.vorname.trim().length < 2) naechstes.vorname = "Vorname fehlt.";
    if (person.nachname.trim().length < 2) naechstes.nachname = "Nachname fehlt.";
    if (!person.geburtstag) naechstes.geburtstag = "Geburtstag fehlt.";
    else if (!volljaehrig(person.geburtstag)) naechstes.geburtstag = "Der Vertrag braucht ein Alter ab 18 Jahren.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) naechstes.email = "E-Mail fehlt oder ist unvollständig.";
    if (person.telefon.replace(/\D/g, "").length < 6) naechstes.telefon = "Telefonnummer fehlt.";
    if (person.strasse.trim().length < 2) naechstes.strasse = "Straße fehlt.";
    if (!person.hausnummer.trim()) naechstes.hausnummer = "Hausnummer fehlt.";
    if (person.ort.trim().length < 2) naechstes.ort = "Ort fehlt.";
    setFehler(naechstes);
    return Object.keys(naechstes).length === 0;
  }

  function kontoPruefen(): boolean {
    const naechstes: Record<string, string> = {};
    if (person.zaehlernummer.trim().length < 4) naechstes.zaehlernummer = "Zählernummer fehlt.";
    if (person.vorversorger.trim().length < 3) naechstes.vorversorger = "Vorversorger fehlt. Der volle Name, wie auf der Rechnung.";
    const iban = person.iban.replace(/\s/g, "").toUpperCase();
    if (!/^DE\d{20}$/.test(iban)) naechstes.iban = "Bitte eine deutsche IBAN mit 22 Zeichen.";
    if (person.kontoinhaber.trim().length < 3) naechstes.kontoinhaber = "Kontoinhaber fehlt.";
    if (!person.datenschutz) naechstes.datenschutz = "Bitte die Einwilligung bestätigen.";
    setFehler(naechstes);
    return Object.keys(naechstes).length === 0;
  }

  function absenden() {
    if (!kontoPruefen() || !angebot.gewinner) return;
    const externalId = `prototyp-${Date.now()}`;
    setAuftrag(
      auftragEntwurf(
        angebot,
        { ...person, plz, iban: person.iban.replace(/\s/g, "").toUpperCase() },
        externalId,
      ),
    );
    setStep("fertig");
  }

  function neu() {
    setStep("angaben");
    setPlz("");
    setHaushalt("");
    setKwhEingabe("");
    setFehler({});
    setSchwelle(PROTOTYP_MIN_PROVISION_EUR);
    setPerson(LEERE_PERSON);
    setRechnungHinweis("");
    setAuftrag(null);
    setFestgehalten(null);
  }

  const schrittIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-dvh bg-surface text-marine">
      <p className="bg-marine px-4 py-2 text-center text-xs text-white">
        Prototyp · Kampagne {campaignCode} · Beispielpreise · kein Auftrag an Neue Energie
      </p>
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <Image
          src="/Logo Plasma.png"
          alt="Plasma Energie Solution"
          width={200}
          height={64}
          className="h-10 w-auto object-contain"
          priority
        />

        {step !== "fertig" && !sucht ? (
          <ol className="mt-6 flex gap-2" aria-label="Fortschritt">
            {STEPS.map((eintrag, index) => (
              <li
                key={eintrag}
                className={`h-1.5 flex-1 rounded-full ${index <= schrittIndex ? "bg-violet-brand" : "bg-[#e6e8ef]"}`}
              />
            ))}
          </ol>
        ) : null}

        {sucht ? <Suche verbrauchKwh={verbrauchKwh} schwelle={schwelle} /> : null}
        {step === "angaben" && !sucht ? (
          <Angaben
            plz={plz}
            haushalt={haushalt}
            kwhEingabe={kwhEingabe}
            fehler={fehler}
            onPlz={setPlz}
            onHaushalt={(id) => {
              setHaushalt(id);
              setKwhEingabe("");
              setFehler((aktuell) => {
                const naechstes = { ...aktuell };
                delete naechstes.verbrauch;
                return naechstes;
              });
            }}
            onKwh={(wert) => {
              setKwhEingabe(wert);
              setHaushalt("");
            }}
            onSubmit={zumAngebot}
          />
        ) : null}
        {step === "angebot" && !sucht ? (
          <Angebot
            plz={plz}
            wahl={wahl}
            schwelle={schwelle}
            onSchwelle={setSchwelle}
            onZurueck={() => setStep("angaben")}
            onWeiter={() => {
              if (!wahl.gewinner) return;
              setFestgehalten(wahl);
              setPerson((aktuell) => ({ ...aktuell, plz }));
              setStep("person");
            }}
          />
        ) : null}
        {step === "person" ? (
          <PersonSchritt
            person={person}
            plz={plz}
            fehler={fehler}
            onChange={set}
            onZurueck={() => setStep("angebot")}
            onWeiter={() => {
              if (personPruefen()) setStep("konto");
            }}
          />
        ) : null}
        {step === "konto" ? (
          <KontoSchritt
            person={person}
            angebot={angebot}
            fehler={fehler}
            rechnungHinweis={rechnungHinweis}
            onChange={set}
            onRechnung={() => {
              setPerson((aktuell) => ({
                ...aktuell,
                zaehlernummer: aktuell.zaehlernummer || "1APA0123456789",
                vorversorger: aktuell.vorversorger || "Vattenfall Europe Sales GmbH",
                iban: aktuell.iban || "DE89370400440532013000",
                kontoinhaber: aktuell.kontoinhaber || `${aktuell.vorname} ${aktuell.nachname}`.trim(),
                strasse: aktuell.strasse || "Beispielweg",
                hausnummer: aktuell.hausnummer || "12",
                ort: aktuell.ort || "Dresden",
              }));
              setRechnungHinweis("Beispielwerte eingesetzt. Im Prototyp wird kein Foto gelesen.");
            }}
            onZurueck={() => setStep("person")}
            onSubmit={absenden}
          />
        ) : null}
        {step === "fertig" && auftrag ? <Fertig auftrag={auftrag} onNeu={neu} /> : null}
      </div>
    </div>
  );
}

function Suche({ verbrauchKwh, schwelle }: { verbrauchKwh: number; schwelle: number }) {
  return (
    <div className="mt-16" aria-live="polite">
      <p className="text-2xl font-medium leading-tight">Wir stellen Ihren Tarif zusammen.</p>
      <p className="mt-3 text-sm text-[#5c6178]">
        {kwhFmt.format(verbrauchKwh)} kWh, Schwelle {schwelle} € Provision, Beispielkatalog.
      </p>
    </div>
  );
}

function Angaben({
  plz,
  haushalt,
  kwhEingabe,
  fehler,
  onPlz,
  onHaushalt,
  onKwh,
  onSubmit,
}: {
  plz: string;
  haushalt: string;
  kwhEingabe: string;
  fehler: Record<string, string>;
  onPlz: (wert: string) => void;
  onHaushalt: (id: string) => void;
  onKwh: (wert: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h1 className="text-3xl font-medium leading-tight">Ihr Stromtarif.</h1>
      <p className="mt-3 text-base leading-relaxed text-[#5c6178]">
        PLZ und Haushaltsgröße. Danach sehen Sie einen Tarif.
      </p>

      <div className="mt-8">
        <Field label="Postleitzahl" error={fehler.plz}>
          <input
            className={inputClass}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={plz}
            onChange={(event) => onPlz(event.target.value.replace(/\D/g, "").slice(0, 5))}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-marine">Personen im Haushalt</legend>
        <div className="grid grid-cols-4 gap-2">
          {HAUSHALTE.map((eintrag) => {
            const aktiv = haushalt === eintrag.id && !kwhEingabe;
            return (
              <button
                key={eintrag.id}
                type="button"
                aria-pressed={aktiv}
                onClick={() => onHaushalt(eintrag.id)}
                className={`rounded-2xl border px-2 py-4 text-center ${
                  aktiv ? "border-violet-brand bg-white" : "border-[#e6e8ef] bg-white"
                }`}
              >
                <span className="block text-xl font-medium">{eintrag.label}</span>
                <span className="mt-1 block text-xs text-[#5c6178]">{kwhFmt.format(eintrag.kwh)}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#5c6178]">1 Person rechnet mit 1.500 kWh, jede weitere mit etwa 1.000 kWh mehr.</p>
      </fieldset>

      <div className="mt-6">
        <Field label="Jahresverbrauch in kWh, falls bekannt" error={fehler.verbrauch}>
          <input
            className={inputClass}
            inputMode="numeric"
            value={kwhEingabe}
            onChange={(event) => onKwh(event.target.value)}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white"
      >
        Tarif anzeigen
      </button>
    </form>
  );
}

function Angebot({
  plz,
  wahl,
  schwelle,
  onSchwelle,
  onZurueck,
  onWeiter,
}: {
  plz: string;
  wahl: Tarifwahl;
  schwelle: number;
  onSchwelle: (wert: number) => void;
  onZurueck: () => void;
  onWeiter: () => void;
}) {
  const tarif = wahl.gewinner;
  const monat = tarif ? tarif.jahreskostenEur / 12 : 0;

  return (
    <div className="mt-8">
      <button type="button" onClick={onZurueck} className="text-sm text-[#5c6178]">
        Angaben ändern
      </button>
      <h1 className="mt-3 text-3xl font-medium leading-tight">Ihr Vorschlag.</h1>
      <p className="mt-2 text-sm text-[#5c6178]">
        PLZ {plz}, gerechnet mit {kwhFmt.format(wahl.verbrauchKwh)} kWh.
      </p>

      {tarif ? (
        <article className="mt-6 rounded-3xl bg-white p-6 shadow-ambient" aria-live="polite">
          <p className="text-sm text-[#5c6178]">{tarif.anbieter}</p>
          <h2 className="text-2xl font-medium">{tarif.name}</h2>
          <p className="mt-6 text-4xl font-medium tracking-tight">{euro.format(tarif.jahreskostenEur)}</p>
          <p className="text-sm text-[#5c6178]">im Jahr</p>
          <p className="mt-4 text-base">{euro.format(monat)} geschätzter monatlicher Abschlag</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#5c6178]">Arbeitspreis</dt>
              <dd>{ct.format(tarif.arbeitspreisCt)} ct/kWh</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#5c6178]">Grundpreis</dt>
              <dd>{euro.format(tarif.grundpreisEurJahr)} / Jahr</dd>
            </div>
            {tarif.bonusEur > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[#5c6178]">Bonus</dt>
                <dd>{euro.format(tarif.bonusEur)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-[#5c6178]">Laufzeit</dt>
              <dd>{tarif.laufzeitMonate} Monate</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed">
            Unter den Tarifen, die wir anbieten, ist das der günstigste. Der Preis gilt für die
            genannten kWh.
          </p>
        </article>
      ) : (
        <p className="mt-6 rounded-3xl bg-white p-6 text-base leading-relaxed shadow-ambient">
          Über der Schwelle von {schwelle} € liegt kein Tarif. Die Schwelle im Kasten unten senken,
          dann erscheint ein Vorschlag.
        </p>
      )}

      <button
        type="button"
        disabled={!tarif}
        onClick={onWeiter}
        className="mt-6 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white disabled:opacity-40"
      >
        Diesen Tarif beauftragen
      </button>

      <SystemKasten wahl={wahl} schwelle={schwelle} onSchwelle={onSchwelle} />
    </div>
  );
}

function SystemKasten({
  wahl,
  schwelle,
  onSchwelle,
}: {
  wahl: Tarifwahl;
  schwelle: number;
  onSchwelle: (wert: number) => void;
}) {
  return (
    <details open className="mt-8 rounded-3xl border border-dashed border-[#c9c6dc] bg-white p-5">
      <summary className="cursor-pointer text-sm font-medium">Was das System entschieden hat</summary>
      <p className="mt-3 text-sm leading-relaxed text-[#5c6178]">
        Nur im Prototyp sichtbar. Der Kunde sieht die Provision nicht. Ideal übernimmt Preis und
        Provision aus dem Laura-Lauf und rechnet sie auf {kwhFmt.format(wahl.verbrauchKwh)} kWh. Die
        anderen Tarife sind erfunden.
      </p>
      <label className="mt-4 block text-sm font-medium">
        Mindestprovision nach Bonus
        <input
          className={`${inputClass} mt-1.5`}
          type="number"
          min={0}
          max={200}
          value={schwelle}
          onChange={(event) => onSchwelle(Number(event.target.value) || 0)}
        />
      </label>
      <ul className="mt-4 divide-y divide-[#eef0f4]">
        {wahl.geprueft.map((tarif) => (
          <li key={tarif.id} className="py-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium">
                {tarif.anbieter} {tarif.name}
              </span>
              <span>{euro.format(tarif.jahreskostenEur)}</span>
            </div>
            <p className="mt-1 text-[#5c6178]">
              Provision {tarif.provisionNachBonusEur} €
              {tarif.bonusEur > 0 ? ` · Bonus ${euro.format(tarif.bonusEur)}` : ""} · {tarif.grund}
            </p>
          </li>
        ))}
      </ul>
    </details>
  );
}

function PersonSchritt({
  person,
  plz,
  fehler,
  onChange,
  onZurueck,
  onWeiter,
}: {
  person: Person;
  plz: string;
  fehler: Record<string, string>;
  onChange: <K extends keyof Person>(key: K, value: Person[K]) => void;
  onZurueck: () => void;
  onWeiter: () => void;
}) {
  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        onWeiter();
      }}
    >
      <button type="button" onClick={onZurueck} className="text-sm text-[#5c6178]">
        Zurück zum Tarif
      </button>
      <h1 className="mt-3 text-3xl font-medium leading-tight">Wer den Vertrag schließt.</h1>
      <div className="mt-8 space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Anrede</legend>
          <div className="grid grid-cols-2 gap-2">
            {["Frau", "Herr"].map((anrede) => (
              <button
                key={anrede}
                type="button"
                aria-pressed={person.anrede === anrede}
                onClick={() => onChange("anrede", anrede)}
                className={`rounded-xl border py-3 ${
                  person.anrede === anrede ? "border-violet-brand bg-white" : "border-[#e6e8ef] bg-white"
                }`}
              >
                {anrede}
              </button>
            ))}
          </div>
          {fehler.anrede ? <span className="mt-1 block text-sm text-red-700">{fehler.anrede}</span> : null}
        </fieldset>
        <Field label="Vorname" error={fehler.vorname}>
          <input className={inputClass} autoComplete="given-name" value={person.vorname} onChange={(event) => onChange("vorname", event.target.value)} />
        </Field>
        <Field label="Nachname" error={fehler.nachname}>
          <input className={inputClass} autoComplete="family-name" value={person.nachname} onChange={(event) => onChange("nachname", event.target.value)} />
        </Field>
        <Field label="Geburtstag" error={fehler.geburtstag}>
          <input className={inputClass} type="date" autoComplete="bday" value={person.geburtstag} onChange={(event) => onChange("geburtstag", event.target.value)} />
        </Field>
        <Field label="E-Mail" error={fehler.email}>
          <input className={inputClass} type="email" autoComplete="email" inputMode="email" value={person.email} onChange={(event) => onChange("email", event.target.value)} />
        </Field>
        <Field label="Telefon" error={fehler.telefon}>
          <input className={inputClass} type="tel" autoComplete="tel" inputMode="tel" value={person.telefon} onChange={(event) => onChange("telefon", event.target.value)} />
        </Field>
        <Field label="Straße" error={fehler.strasse}>
          <input className={inputClass} autoComplete="address-line1" value={person.strasse} onChange={(event) => onChange("strasse", event.target.value)} />
        </Field>
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <Field label="Hausnummer" error={fehler.hausnummer}>
            <input className={inputClass} value={person.hausnummer} onChange={(event) => onChange("hausnummer", event.target.value)} />
          </Field>
          <Field label="PLZ">
            <input className={inputClass} value={plz} readOnly />
          </Field>
        </div>
        <Field label="Ort" error={fehler.ort}>
          <input className={inputClass} autoComplete="address-level2" value={person.ort} onChange={(event) => onChange("ort", event.target.value)} />
        </Field>
      </div>
      <button type="submit" className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white">
        Weiter zu Zähler und Konto
      </button>
    </form>
  );
}

function KontoSchritt({
  person,
  angebot,
  fehler,
  rechnungHinweis,
  onChange,
  onRechnung,
  onZurueck,
  onSubmit,
}: {
  person: Person;
  angebot: Tarifwahl;
  fehler: Record<string, string>;
  rechnungHinweis: string;
  onChange: <K extends keyof Person>(key: K, value: Person[K]) => void;
  onRechnung: () => void;
  onZurueck: () => void;
  onSubmit: () => void;
}) {
  const tarif = angebot.gewinner;
  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <button type="button" onClick={onZurueck} className="text-sm text-[#5c6178]">
        Zurück
      </button>
      {tarif ? (
        <p className="mt-3 text-sm text-[#5c6178]">
          {tarif.anbieter} {tarif.name} · {euro.format(tarif.jahreskostenEur)} im Jahr
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-medium leading-tight">Zähler und Konto.</h1>
      <button
        type="button"
        onClick={onRechnung}
        className="mt-6 w-full rounded-xl border border-[#e6e8ef] bg-white px-4 py-4 text-base font-medium"
      >
        Beispieldaten aus einer Rechnung
      </button>
      {rechnungHinweis ? <p className="mt-2 text-sm text-[#5c6178]">{rechnungHinweis}</p> : null}
      <div className="mt-6 space-y-4">
        <Field label="Zählernummer" error={fehler.zaehlernummer}>
          <input className={inputClass} value={person.zaehlernummer} onChange={(event) => onChange("zaehlernummer", event.target.value)} />
        </Field>
        <Field label="Bisheriger Versorger" error={fehler.vorversorger}>
          <input className={inputClass} value={person.vorversorger} onChange={(event) => onChange("vorversorger", event.target.value)} />
        </Field>
        <Field label="IBAN" error={fehler.iban}>
          <input className={inputClass} autoComplete="off" spellCheck={false} value={person.iban} onChange={(event) => onChange("iban", event.target.value)} />
        </Field>
        <Field label="Kontoinhaber" error={fehler.kontoinhaber}>
          <input className={inputClass} value={person.kontoinhaber} onChange={(event) => onChange("kontoinhaber", event.target.value)} />
        </Field>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={person.datenschutz}
            onChange={(event) => onChange("datenschutz", event.target.checked)}
          />
          <span>Ich willige in die Verarbeitung der Angaben zum Zweck dieser Anfrage ein.</span>
        </label>
        {fehler.datenschutz ? <span className="block text-sm text-red-700">{fehler.datenschutz}</span> : null}
      </div>
      <button type="submit" className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white">
        Zahlungspflichtig bestellen
      </button>
      <p className="mt-3 text-center text-xs text-[#5c6178]">Im Prototyp bleibt der Auftrag auf diesem Gerät.</p>
    </form>
  );
}

function Fertig({ auftrag, onNeu }: { auftrag: Record<string, string>; onNeu: () => void }) {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-medium leading-tight">Erfasst.</h1>
      <p className="mt-3 text-base leading-relaxed text-[#5c6178]">
        Entwurf für {auftrag.firstname} {auftrag.lastname}, Tarif {auftrag.tariffName}. Der Body
        bleibt auf diesem Gerät, testMode ist {auftrag.testMode}.
      </p>
      <dl className="mt-6 space-y-2 rounded-3xl bg-white p-6 text-sm shadow-ambient">
        <div className="flex justify-between gap-4">
          <dt className="text-[#5c6178]">Tarif</dt>
          <dd className="text-right">{auftrag.tariffName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#5c6178]">Verbrauch</dt>
          <dd>{kwhFmt.format(Number(auftrag.consumption))} kWh</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#5c6178]">Externe ID</dt>
          <dd className="text-right">{auftrag.externalId}</dd>
        </div>
      </dl>
      <details className="mt-4 rounded-3xl border border-dashed border-[#c9c6dc] bg-white p-5">
        <summary className="cursor-pointer text-sm font-medium">Body für POST /contracts</summary>
        <pre className="mt-3 overflow-x-auto text-xs leading-relaxed">{JSON.stringify(auftrag, null, 2)}</pre>
      </details>
      <button type="button" onClick={onNeu} className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white">
        Neu beginnen
      </button>
    </div>
  );
}
