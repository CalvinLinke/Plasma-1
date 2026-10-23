"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Sprachwahl from "../Sprachwahl";
import {
  HAUSHALTE,
  PROTOTYP_MIN_PROVISION_EUR,
  auftragEntwurf,
  waehleTarif,
  type AuftragPerson,
  type TarifGrund,
  type Tarifwahl,
} from "@/lib/prototyp-wechsel";
import { TEXTE, formate, satz, type FehlerKey, type Sprache, type Texte } from "@/lib/prototyp-texte";

type Step = "angaben" | "angebot" | "person" | "konto" | "fertig";

const STEPS: Step[] = ["angaben", "angebot", "person", "konto"];

type Fluss = { t: Texte; zahlen: ReturnType<typeof formate> };
const FlussCtx = createContext<Fluss>({ t: TEXTE.de, zahlen: formate("de") });

function useFluss() {
  return useContext(FlussCtx);
}

function grundSatz(t: Texte, grund: TarifGrund, betrag: number, schwelle: number): string {
  if (grund === "unter") return satz(t.grundUnter, { betrag, schwelle });
  if (grund === "guenstigster") return t.grundGewinner;
  return t.grundTeurer;
}

const inputClass =
  "w-full rounded-xl border border-[#e6e8ef] bg-white px-4 py-3 text-base text-marine outline-none focus:border-violet-brand";
const ltrInput = `${inputClass} [direction:ltr]`;

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

export default function WechselFlow({ campaignCode, sprache }: { campaignCode: string; sprache: Sprache }) {
  const [step, setStep] = useState<Step>("angaben");
  const [sucht, setSucht] = useState(false);
  const [plz, setPlz] = useState("");
  const [haushalt, setHaushalt] = useState<string>("");
  const [kwhEingabe, setKwhEingabe] = useState("");
  const [fehler, setFehler] = useState<Partial<Record<string, FehlerKey>>>({});
  const [schwelle, setSchwelle] = useState(PROTOTYP_MIN_PROVISION_EUR);
  const [person, setPerson] = useState<Person>(LEERE_PERSON);
  const [beispiel, setBeispiel] = useState(false);
  const texte = TEXTE[sprache];
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

  const wahl = useMemo(() => waehleTarif(verbrauchKwh || HAUSHALTE[1].kwh, schwelle), [verbrauchKwh, schwelle]);
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
    const naechstes: Partial<Record<string, FehlerKey>> = {};
    if (!/^\d{5}$/.test(plz)) naechstes.plz = "plz";
    if (verbrauchKwh < 500 || verbrauchKwh > 50000) naechstes.verbrauch = "verbrauch";
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
    const naechstes: Partial<Record<string, FehlerKey>> = {};
    if (!person.anrede) naechstes.anrede = "anrede";
    if (person.vorname.trim().length < 2) naechstes.vorname = "vorname";
    if (person.nachname.trim().length < 2) naechstes.nachname = "nachname";
    if (!person.geburtstag) naechstes.geburtstag = "geburtstag";
    else if (!volljaehrig(person.geburtstag)) naechstes.geburtstag = "volljaehrig";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) naechstes.email = "email";
    if (person.telefon.replace(/\D/g, "").length < 6) naechstes.telefon = "telefon";
    if (person.strasse.trim().length < 2) naechstes.strasse = "strasse";
    if (!person.hausnummer.trim()) naechstes.hausnummer = "hausnummer";
    if (person.ort.trim().length < 2) naechstes.ort = "ort";
    setFehler(naechstes);
    return Object.keys(naechstes).length === 0;
  }

  function kontoPruefen(): boolean {
    const naechstes: Partial<Record<string, FehlerKey>> = {};
    if (person.zaehlernummer.trim().length < 4) naechstes.zaehlernummer = "zaehlernummer";
    if (person.vorversorger.trim().length < 3) naechstes.vorversorger = "vorversorger";
    const iban = person.iban.replace(/\s/g, "").toUpperCase();
    if (!/^DE\d{20}$/.test(iban)) naechstes.iban = "iban";
    if (person.kontoinhaber.trim().length < 3) naechstes.kontoinhaber = "kontoinhaber";
    if (!person.datenschutz) naechstes.datenschutz = "datenschutz";
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
    setBeispiel(false);
    setAuftrag(null);
    setFestgehalten(null);
  }

  const schrittIndex = STEPS.indexOf(step);

  return (
    <FlussCtx.Provider value={{ t: texte, zahlen: formate(sprache) }}>
    <div className="min-h-dvh bg-surface text-marine">
      <p className="bg-marine px-4 py-2 text-center text-xs text-white">
        {satz(texte.banner, { code: campaignCode })}
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
        <Sprachwahl sprache={sprache} />

        {step !== "fertig" && !sucht ? (
          <ol className="mt-6 flex gap-2" aria-label={texte.fortschritt}>
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
            beispiel={beispiel}
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
              setBeispiel(true);
            }}
            onZurueck={() => setStep("person")}
            onSubmit={absenden}
          />
        ) : null}
        {step === "fertig" && auftrag ? <Fertig auftrag={auftrag} onNeu={neu} /> : null}
      </div>
    </div>
    </FlussCtx.Provider>
  );
}

function Suche({ verbrauchKwh, schwelle }: { verbrauchKwh: number; schwelle: number }) {
  const { t, zahlen } = useFluss();
  return (
    <div className="mt-16" aria-live="polite">
      <p className="text-2xl font-medium leading-tight">{t.sucheTitel}</p>
      <p className="mt-3 text-sm text-[#5c6178]">
        {satz(t.sucheDetail, { kwh: zahlen.kwh.format(verbrauchKwh), schwelle })}
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
  fehler: Partial<Record<string, FehlerKey>>;
  onPlz: (wert: string) => void;
  onHaushalt: (id: string) => void;
  onKwh: (wert: string) => void;
  onSubmit: () => void;
}) {
  const { t, zahlen } = useFluss();
  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h1 className="text-3xl font-medium leading-tight">{t.stromtitel}</h1>
      <p className="mt-3 text-base leading-relaxed text-[#5c6178]">{t.stromlead}</p>

      <div className="mt-8">
        <Field label={t.plz} error={fehler.plz ? t.fehler[fehler.plz] : undefined}>
          <input
            className={ltrInput}
            dir="ltr"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={plz}
            onChange={(event) => onPlz(event.target.value.replace(/\D/g, "").slice(0, 5))}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-marine">{t.personen}</legend>
        <div className="grid grid-cols-5 gap-2">
          {HAUSHALTE.map((eintrag) => {
            const aktiv = haushalt === eintrag.id && !kwhEingabe;
            return (
              <button
                key={eintrag.id}
                type="button"
                aria-pressed={aktiv}
                onClick={() => onHaushalt(eintrag.id)}
                className={`rounded-2xl border px-1 py-3 text-center ${
                  aktiv ? "border-violet-brand bg-white" : "border-[#e6e8ef] bg-white"
                }`}
              >
                <span className="block text-xl font-medium">{eintrag.label}</span>
                <span className="mt-1 block text-xs text-[#5c6178]">{zahlen.kwh.format(eintrag.kwh)}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#5c6178]">
          {t.haushaltHinweis}
        </p>
      </fieldset>

      <div className="mt-6">
        <Field label={t.verbrauchLabel} error={fehler.verbrauch ? t.fehler[fehler.verbrauch] : undefined}>
          <input
            className={ltrInput}
            dir="ltr"
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
        {t.tarifAnzeigen}
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
  const { t, zahlen } = useFluss();
  const tarif = wahl.gewinner;
  const monat = tarif ? tarif.jahreskostenEur / 12 : 0;

  return (
    <div className="mt-8">
      <button type="button" onClick={onZurueck} className="text-sm text-[#5c6178]">
        {t.angabenAendern}
      </button>
      <h1 className="mt-3 text-3xl font-medium leading-tight">{t.vorschlag}</h1>
      <p className="mt-2 text-sm text-[#5c6178]">
        {satz(t.vorschlagMeta, { plz, kwh: zahlen.kwh.format(wahl.verbrauchKwh) })}
      </p>

      {tarif ? (
        <article className="mt-6 rounded-3xl bg-white p-6 shadow-ambient" aria-live="polite">
          <p className="text-sm text-[#5c6178]">{tarif.anbieter}</p>
          <h2 className="text-2xl font-medium">{tarif.name}</h2>
          <p className="mt-6 text-4xl font-medium tracking-tight" dir="ltr">{zahlen.euro.format(tarif.jahreskostenEur)}</p>
          <p className="text-sm text-[#5c6178]">{t.imJahr}</p>
          <p className="mt-4 text-base">{satz(t.abschlag, { betrag: zahlen.euro.format(monat) })}</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#5c6178]">{t.arbeitspreis}</dt>
              <dd dir="ltr">{zahlen.ct.format(tarif.arbeitspreisCt)} ct/kWh</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#5c6178]">{t.grundpreis}</dt>
              <dd dir="ltr">{zahlen.euro.format(tarif.grundpreisEurJahr)} {t.proJahr}</dd>
            </div>
            {tarif.bonusEur > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[#5c6178]">{t.bonus}</dt>
                <dd dir="ltr">{zahlen.euro.format(tarif.bonusEur)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-[#5c6178]">{t.laufzeit}</dt>
              <dd>{satz(t.monate, { anzahl: tarif.laufzeitMonate })}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed">{t.pitch}</p>
        </article>
      ) : (
        <p className="mt-6 rounded-3xl bg-white p-6 text-base leading-relaxed shadow-ambient">
          {satz(t.keinTarif, { schwelle })}
        </p>
      )}

      <button
        type="button"
        disabled={!tarif}
        onClick={onWeiter}
        className="mt-6 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white disabled:opacity-40"
      >
        {t.beauftragen}
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
  const { t, zahlen } = useFluss();
  return (
    <details open className="mt-8 rounded-3xl border border-dashed border-[#c9c6dc] bg-white p-5">
      <summary className="cursor-pointer text-sm font-medium">{t.systemTitel}</summary>
      <p className="mt-3 text-sm leading-relaxed text-[#5c6178]">
        {satz(t.systemText, { kwh: zahlen.kwh.format(wahl.verbrauchKwh) })}
      </p>
      <label className="mt-4 block text-sm font-medium">
        {t.mindestprovision}
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
              <span dir="ltr">{zahlen.euro.format(tarif.jahreskostenEur)}</span>
            </div>
            <p className="mt-1 text-[#5c6178]">
              {satz(t.provisionZeile, { betrag: tarif.provisionNachBonusEur })}
              {tarif.bonusEur > 0 ? ` · ${t.bonus} ${zahlen.euro.format(tarif.bonusEur)}` : ""} · {grundSatz(t, tarif.grund, tarif.provisionNachBonusEur, schwelle)}
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
  fehler: Partial<Record<string, FehlerKey>>;
  onChange: <K extends keyof Person>(key: K, value: Person[K]) => void;
  onZurueck: () => void;
  onWeiter: () => void;
}) {
  const { t } = useFluss();
  const anreden = [
    { wert: "Frau", label: t.frau },
    { wert: "Herr", label: t.herr },
  ] as const;
  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        onWeiter();
      }}
    >
      <button type="button" onClick={onZurueck} className="text-sm text-[#5c6178]">
        {t.zurueckTarif}
      </button>
      <h1 className="mt-3 text-3xl font-medium leading-tight">{t.werSchliesst}</h1>
      <div className="mt-8 space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t.anrede}</legend>
          <div className="grid grid-cols-2 gap-2">
            {anreden.map((anrede) => (
              <button
                key={anrede.wert}
                type="button"
                aria-pressed={person.anrede === anrede.wert}
                onClick={() => onChange("anrede", anrede.wert)}
                className={`rounded-xl border py-3 ${
                  person.anrede === anrede.wert ? "border-violet-brand bg-white" : "border-[#e6e8ef] bg-white"
                }`}
              >
                {anrede.label}
              </button>
            ))}
          </div>
          {fehler.anrede ? <span className="mt-1 block text-sm text-red-700">{t.fehler[fehler.anrede]}</span> : null}
        </fieldset>
        <Field label={t.vorname} error={fehler.vorname ? t.fehler[fehler.vorname] : undefined}>
          <input className={inputClass} autoComplete="given-name" value={person.vorname} onChange={(event) => onChange("vorname", event.target.value)} />
        </Field>
        <Field label={t.nachname} error={fehler.nachname ? t.fehler[fehler.nachname] : undefined}>
          <input className={inputClass} autoComplete="family-name" value={person.nachname} onChange={(event) => onChange("nachname", event.target.value)} />
        </Field>
        <Field label={t.geburtstag} error={fehler.geburtstag ? t.fehler[fehler.geburtstag] : undefined}>
          <input className={ltrInput} dir="ltr" type="date" autoComplete="bday" value={person.geburtstag} onChange={(event) => onChange("geburtstag", event.target.value)} />
        </Field>
        <Field label={t.email} error={fehler.email ? t.fehler[fehler.email] : undefined}>
          <input className={ltrInput} dir="ltr" type="email" autoComplete="email" inputMode="email" value={person.email} onChange={(event) => onChange("email", event.target.value)} />
        </Field>
        <Field label={t.telefon} error={fehler.telefon ? t.fehler[fehler.telefon] : undefined}>
          <input className={ltrInput} dir="ltr" type="tel" autoComplete="tel" inputMode="tel" value={person.telefon} onChange={(event) => onChange("telefon", event.target.value)} />
        </Field>
        <Field label={t.strasse} error={fehler.strasse ? t.fehler[fehler.strasse] : undefined}>
          <input className={inputClass} autoComplete="address-line1" value={person.strasse} onChange={(event) => onChange("strasse", event.target.value)} />
        </Field>
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <Field label={t.hausnummer} error={fehler.hausnummer ? t.fehler[fehler.hausnummer] : undefined}>
            <input className={ltrInput} dir="ltr" value={person.hausnummer} onChange={(event) => onChange("hausnummer", event.target.value)} />
          </Field>
          <Field label={t.plz}>
            <input className={ltrInput} dir="ltr" value={plz} readOnly />
          </Field>
        </div>
        <Field label={t.ort} error={fehler.ort ? t.fehler[fehler.ort] : undefined}>
          <input className={inputClass} autoComplete="address-level2" value={person.ort} onChange={(event) => onChange("ort", event.target.value)} />
        </Field>
      </div>
      <button type="submit" className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white">
        {t.weiterKonto}
      </button>
    </form>
  );
}

function KontoSchritt({
  person,
  angebot,
  fehler,
  beispiel,
  onChange,
  onRechnung,
  onZurueck,
  onSubmit,
}: {
  person: Person;
  angebot: Tarifwahl;
  fehler: Partial<Record<string, FehlerKey>>;
  beispiel: boolean;
  onChange: <K extends keyof Person>(key: K, value: Person[K]) => void;
  onRechnung: () => void;
  onZurueck: () => void;
  onSubmit: () => void;
}) {
  const { t, zahlen } = useFluss();
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
        {t.zurueck}
      </button>
      {tarif ? (
        <p className="mt-3 text-sm text-[#5c6178]">
          {satz(t.tarifZeile, { name: `${tarif.anbieter} ${tarif.name}`, betrag: zahlen.euro.format(tarif.jahreskostenEur) })}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-medium leading-tight">{t.zaehlerTitel}</h1>
      <button
        type="button"
        onClick={onRechnung}
        className="mt-6 w-full rounded-xl border border-[#e6e8ef] bg-white px-4 py-4 text-base font-medium"
      >
        {t.beispieldaten}
      </button>
      {beispiel ? <p className="mt-2 text-sm text-[#5c6178]">{t.beispielHinweis}</p> : null}
      <div className="mt-6 space-y-4">
        <Field label={t.zaehlernummer} error={fehler.zaehlernummer ? t.fehler[fehler.zaehlernummer] : undefined}>
          <input className={ltrInput} dir="ltr" value={person.zaehlernummer} onChange={(event) => onChange("zaehlernummer", event.target.value)} />
        </Field>
        <Field label={t.vorversorger} error={fehler.vorversorger ? t.fehler[fehler.vorversorger] : undefined}>
          <input className={inputClass} value={person.vorversorger} onChange={(event) => onChange("vorversorger", event.target.value)} />
        </Field>
        <Field label={t.iban} error={fehler.iban ? t.fehler[fehler.iban] : undefined}>
          <input className={ltrInput} dir="ltr" autoComplete="off" spellCheck={false} value={person.iban} onChange={(event) => onChange("iban", event.target.value)} />
        </Field>
        <Field label={t.kontoinhaber} error={fehler.kontoinhaber ? t.fehler[fehler.kontoinhaber] : undefined}>
          <input className={inputClass} value={person.kontoinhaber} onChange={(event) => onChange("kontoinhaber", event.target.value)} />
        </Field>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={person.datenschutz}
            onChange={(event) => onChange("datenschutz", event.target.checked)}
          />
          <span>{t.einwilligung}</span>
        </label>
        {fehler.datenschutz ? <span className="block text-sm text-red-700">{t.fehler[fehler.datenschutz]}</span> : null}
      </div>
      <button type="submit" className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white">
        {t.bestellen}
      </button>
      <p className="mt-3 text-center text-xs text-[#5c6178]">{t.vertragDeutsch}</p>
      <p className="mt-1 text-center text-xs text-[#5c6178]">{t.bleibtGeraet}</p>
    </form>
  );
}

function Fertig({ auftrag, onNeu }: { auftrag: Record<string, string>; onNeu: () => void }) {
  const { t, zahlen } = useFluss();
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-medium leading-tight">{t.erfasst}</h1>
      <p className="mt-3 text-base leading-relaxed text-[#5c6178]">
        {satz(t.erfasstText, {
          name: `${auftrag.firstname} ${auftrag.lastname}`,
          tarif: auftrag.tariffName,
          testMode: auftrag.testMode,
        })}
      </p>
      <p className="mt-2 text-sm text-[#5c6178]">{t.vertragDeutsch}</p>
      <dl className="mt-6 space-y-2 rounded-3xl bg-white p-6 text-sm shadow-ambient">
        <div className="flex justify-between gap-4">
          <dt className="text-[#5c6178]">{t.tarif}</dt>
          <dd className="text-end">{auftrag.tariffName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#5c6178]">{t.verbrauch}</dt>
          <dd dir="ltr">{zahlen.kwh.format(Number(auftrag.consumption))} kWh</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#5c6178]">{t.externeId}</dt>
          <dd className="text-end" dir="ltr">{auftrag.externalId}</dd>
        </div>
      </dl>
      <details className="mt-4 rounded-3xl border border-dashed border-[#c9c6dc] bg-white p-5">
        <summary className="cursor-pointer text-sm font-medium">{t.bodyTitel}</summary>
        <pre className="mt-3 overflow-x-auto text-xs leading-relaxed" dir="ltr">{JSON.stringify(auftrag, null, 2)}</pre>
      </details>
      <button type="button" onClick={onNeu} className="mt-8 w-full rounded-xl bg-violet-brand px-4 py-4 text-base font-medium text-white">
        {t.neu}
      </button>
    </div>
  );
}
