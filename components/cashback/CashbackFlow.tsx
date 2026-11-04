"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Camera, Check, Leaf, Loader2, Phone, ShieldCheck } from "lucide-react";
import { FLAGGEN, SPRACHEN, formate, satz, type Sprache } from "@/lib/prototyp-texte";
import { HAUSHALTE } from "@/lib/prototyp-wechsel";
import { cashbackTexte, type CashbackTexte } from "@/lib/cashback/texte";
import {
  LEERE_PERSON,
  ibanNormal,
  personPruefen,
  vertragPruefen,
  type CashbackPerson,
  type Fehlerliste,
  type Zustimmungen,
} from "@/lib/cashback/pruefung";
import type { KundenTarif } from "@/lib/cashback/angebot";

type Schritt = "angaben" | "angebot" | "person" | "vertrag" | "fertig";
const FORTSCHRITT: Schritt[] = ["angaben", "angebot", "person", "vertrag"];

const input =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-marine outline-none transition-colors focus:border-violet-brand";
const ltr = `${input} [direction:ltr]`;
const knopf =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-brand px-4 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100";

function Feld({
  label,
  fehler,
  hilfe,
  children,
}: {
  label: string;
  fehler?: string;
  hilfe?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-marine">{label}</span>
      {children}
      {hilfe && !fehler ? <span className="mt-1 block text-xs leading-relaxed text-gray-500">{hilfe}</span> : null}
      {fehler ? <span className="mt-1 block text-sm text-red-700">{fehler}</span> : null}
    </label>
  );
}

function Haken({
  checked,
  onChange,
  fehler,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  fehler?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-violet-brand"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{children}</span>
      </label>
      {fehler ? <span className="mt-1 block pl-8 text-sm text-red-700">{fehler}</span> : null}
    </div>
  );
}

function dresdenOrt(plz: string): string | null {
  const n = Number(plz);
  return /^\d{5}$/.test(plz) && n >= 1067 && n <= 1328 ? "Dresden" : null;
}

export default function CashbackFlow({
  code,
  quelle,
  betragEur = 50,
}: {
  code: string;
  quelle: string;
  betragEur?: number;
}) {
  const [sprache, setSprache] = useState<Sprache>("de");
  const t = useMemo(() => cashbackTexte(sprache), [sprache]);
  const z = useMemo(() => formate(sprache), [sprache]);

  const [schritt, setSchritt] = useState<Schritt>("angaben");
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");
  const [haushalt, setHaushalt] = useState("");
  const [kwhEingabe, setKwhEingabe] = useState("");
  const [abschlagHeute, setAbschlagHeute] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [problem, setProblem] = useState<"keinTarif" | "fehler" | null>(null);
  const [tarif, setTarif] = useState<KundenTarif | null>(null);
  const [token, setToken] = useState("");
  const [demo, setDemo] = useState(false);
  const [person, setPerson] = useState<CashbackPerson>(LEERE_PERSON);
  const [zustimmung, setZustimmung] = useState<Zustimmungen>({ bestellung: false, datenschutz: false, cashback: false });
  const [fehler, setFehler] = useState<Fehlerliste & { plzAngabe?: string; verbrauch?: string }>({});
  const [sendet, setSendet] = useState(false);
  const [sendeFehler, setSendeFehler] = useState<string | null>(null);
  const [vorgang, setVorgang] = useState("");
  const [honig, setHonig] = useState("");

  const kwh = useMemo(() => {
    const getippt = Number(kwhEingabe.replace(/\./g, "").replace(",", "."));
    if (kwhEingabe.trim() && Number.isFinite(getippt)) return Math.round(getippt);
    return HAUSHALTE.find((h) => h.id === haushalt)?.kwh ?? 0;
  }, [haushalt, kwhEingabe]);

  const abschlagZahl = Number(abschlagHeute.replace(",", "."));
  const ersparnis =
    tarif && Number.isFinite(abschlagZahl) && abschlagZahl > 0
      ? Math.round(abschlagZahl * 12 - tarif.jahreskostenEur)
      : 0;

  const fm = (key?: string) => (key ? t.meldung(key as Parameters<CashbackTexte["meldung"]>[0]) : undefined);

  function setP<K extends keyof CashbackPerson>(key: K, wert: CashbackPerson[K]) {
    setPerson((p) => ({ ...p, [key]: wert }));
    setFehler((f) => {
      if (!f[key]) return f;
      const n = { ...f };
      delete n[key];
      return n;
    });
  }

  function nachOben() {
    document.getElementById("cashback-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function preisHolen() {
    const f: typeof fehler = {};
    if (!/^\d{5}$/.test(plz)) f.plzAngabe = "plz";
    if (ort.trim().length < 2) f.ort = "ort";
    if (kwh < 500 || kwh > 50000) f.verbrauch = "verbrauch";
    setFehler(f);
    if (Object.keys(f).length) return;

    setLaedt(true);
    setProblem(null);
    try {
      const res = await fetch("/api/cashback/angebot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plz, ort: ort.trim(), kwh }),
      });
      const data = (await res.json()) as { status: string; tarif?: KundenTarif; token?: string; demo?: boolean };
      if (data.status === "ok" && data.tarif && data.token) {
        setTarif(data.tarif);
        setToken(data.token);
        setDemo(Boolean(data.demo));
        setPerson((p) => ({ ...p, plz, ort: p.ort || ort.trim() }));
        setSchritt("angebot");
      } else {
        setProblem(data.status === "keinTarif" ? "keinTarif" : "fehler");
      }
    } catch {
      setProblem("fehler");
    } finally {
      setLaedt(false);
      nachOben();
    }
  }

  function zuVertrag() {
    const f = personPruefen({ ...person, plz });
    setFehler(f);
    if (Object.keys(f).length === 0) {
      setPerson((p) => ({ ...p, kontoinhaber: p.kontoinhaber || `${p.vorname} ${p.nachname}`.trim() }));
      setSchritt("vertrag");
      nachOben();
    }
  }

  async function bestellen() {
    const f = vertragPruefen(person, zustimmung);
    setFehler(f);
    if (Object.keys(f).length) return;
    setSendet(true);
    setSendeFehler(null);
    try {
      const res = await fetch("/api/cashback/auftrag", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          person: { ...person, plz, iban: ibanNormal(person.iban) },
          zustimmungen: zustimmung,
          code,
          quelle,
          sprache,
          abschlagHeute: Number.isFinite(abschlagZahl) ? abschlagZahl : undefined,
          website: honig,
        }),
      });
      const data = (await res.json()) as { status: string; vorgang?: string; fehler?: Fehlerliste };
      if (data.status === "ok" && data.vorgang) {
        setVorgang(data.vorgang);
        setSchritt("fertig");
        nachOben();
      } else if (data.status === "abgelaufen") {
        setSendeFehler(t.abgelaufen);
      } else if (data.status === "ungueltig" && data.fehler) {
        setFehler(data.fehler);
        setSendeFehler(t.sendeFehler);
      } else {
        setSendeFehler(t.sendeFehler);
      }
    } catch {
      setSendeFehler(t.sendeFehler);
    } finally {
      setSendet(false);
    }
  }

  const index = FORTSCHRITT.indexOf(schritt);
  const tarifName = tarif ? `${tarif.name}` : "";
  const anbieter = tarif?.anbieter ?? "";
  const betrag = z.euro.format(betragEur).replace(/,00/, "");

  return (
    <div
      id="cashback-flow"
      dir={sprache === "ar" ? "rtl" : "ltr"}
      lang={sprache === "uk" ? "uk" : sprache}
      className="scroll-mt-24 rounded-3xl border border-gray-100 bg-white p-5 shadow-ambient-md sm:p-7"
    >
      {/* Sprache */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t.spracheAuswahl}>
        {SPRACHEN.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSprache(id)}
            aria-pressed={id === sprache}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
              id === sprache ? "border-violet-brand text-marine" : "border-gray-200 text-gray-500"
            }`}
          >
            <span aria-hidden="true">{FLAGGEN[id]}</span>
            {cashbackTexte(id).spracheName}
          </button>
        ))}
      </div>

      {schritt !== "fertig" ? (
        <ol className="mt-5 flex gap-1.5" aria-label={t.fortschritt}>
          {FORTSCHRITT.map((s, i) => (
            <li key={s} className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-violet-brand" : "bg-gray-100"}`} />
          ))}
        </ol>
      ) : null}

      {demo && schritt !== "angaben" ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">{t.demoHinweis}</p>
      ) : null}

      {/* SCHRITT 1: Angaben */}
      {schritt === "angaben" ? (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void preisHolen();
          }}
        >
          <h2 className="text-2xl font-bold leading-tight text-marine">{t.titel}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{t.lead}</p>

          <div className="mt-6 grid grid-cols-[7.5rem_1fr] gap-3">
            <Feld label={t.plz} fehler={fm(fehler.plzAngabe)}>
              <input
                className={ltr}
                dir="ltr"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={plz}
                onChange={(e) => {
                  const wert = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setPlz(wert);
                  const vorschlag = dresdenOrt(wert);
                  if (vorschlag && !ort) setOrt(vorschlag);
                }}
              />
            </Feld>
            <Feld label={t.ortLabel} fehler={fm(fehler.ort)}>
              <input className={input} autoComplete="address-level2" value={ort} onChange={(e) => setOrt(e.target.value)} />
            </Feld>
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-medium text-marine">{t.personen}</legend>
            <div className="grid grid-cols-5 gap-2">
              {HAUSHALTE.map((h) => {
                const aktiv = haushalt === h.id && !kwhEingabe;
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => {
                      setHaushalt(h.id);
                      setKwhEingabe("");
                      setFehler((f) => ({ ...f, verbrauch: undefined }));
                    }}
                    className={`rounded-2xl border px-1 py-3 text-center transition-colors ${
                      aktiv ? "border-violet-brand bg-violet-brand/5" : "border-gray-200 bg-white"
                    }`}
                  >
                    <span className="block text-xl font-bold text-marine">{h.label}</span>
                    <span className="mt-0.5 block text-[11px] text-gray-500" dir="ltr">
                      {z.kwh.format(h.kwh)}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gray-500">{t.haushaltHinweis}</p>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Feld label={t.verbrauchLabel} fehler={fm(fehler.verbrauch)}>
              <input
                className={ltr}
                dir="ltr"
                inputMode="numeric"
                value={kwhEingabe}
                onChange={(e) => {
                  setKwhEingabe(e.target.value);
                  setHaushalt("");
                }}
              />
            </Feld>
            <Feld label={t.abschlagHeute} hilfe={t.abschlagHinweis}>
              <input
                className={ltr}
                dir="ltr"
                inputMode="decimal"
                value={abschlagHeute}
                onChange={(e) => setAbschlagHeute(e.target.value.replace(/[^\d,.]/g, ""))}
              />
            </Feld>
          </div>

          {problem ? (
            <div className="mt-6 rounded-2xl border border-violet-brand/20 bg-violet-brand/5 p-5">
              <p className="font-semibold text-marine">{problem === "keinTarif" ? t.keinTarifTitel : t.fehlerTitel}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {problem === "keinTarif" ? t.keinTarifText : t.fehlerText}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a href="#foto" className="inline-flex items-center justify-center gap-2 rounded-xl bg-marine px-4 py-3 text-sm font-semibold text-white">
                  <Camera className="h-4 w-4" /> {t.fotoButton}
                </a>
                <a href="tel:+491728182583" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-marine">
                  <Phone className="h-4 w-4" /> {t.anrufen}
                </a>
              </div>
            </div>
          ) : null}

          <button type="submit" className={`${knopf} mt-6`} disabled={laedt}>
            {laedt ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {laedt ? t.sucht : t.preisBerechnen}
          </button>
        </form>
      ) : null}

      {/* SCHRITT 2: Angebot */}
      {schritt === "angebot" && tarif ? (
        <div className="mt-6">
          <button type="button" onClick={() => setSchritt("angaben")} className="inline-flex items-center gap-1 text-sm text-gray-500">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.angabenAendern}
          </button>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-marine">{t.angebotTitel}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {satz(t.angebotMeta, { plz, ort: ort.trim(), kwh: z.kwh.format(kwh) })}
          </p>

          <article className="mt-5 rounded-3xl bg-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">{tarif.anbieter}</p>
                <h3 className="text-xl font-bold text-marine">{tarif.name}</h3>
              </div>
              {tarif.oekostrom ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <Leaf className="h-3.5 w-3.5" /> {t.oeko}
                </span>
              ) : null}
            </div>
            <p className="mt-5 text-4xl font-extrabold tracking-tight text-marine" dir="ltr">
              {z.euro.format(tarif.abschlagEur)}
            </p>
            <p className="text-sm text-gray-500">{t.proMonat}</p>
            <p className="mt-3 text-sm text-gray-600">
              {satz(t.jahreskosten, { betrag: z.euro.format(tarif.jahreskostenEur) })}
            </p>
            {ersparnis >= 10 ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-brand/15 px-3 py-1.5 text-sm font-semibold text-marine">
                <Check className="h-4 w-4" strokeWidth={3} />
                {satz(t.ersparnis, { betrag: z.euro.format(ersparnis) })}
              </p>
            ) : null}
            <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.arbeitspreis}</dt>
                <dd dir="ltr">{z.ct.format(tarif.arbeitspreisCt)} ct/kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.grundpreis}</dt>
                <dd dir="ltr">
                  {z.euro.format(tarif.grundpreisEurJahr)} {t.proJahr}
                </dd>
              </div>
              {tarif.bonusEur > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">{t.bonus}</dt>
                  <dd dir="ltr">{z.euro.format(tarif.bonusEur)}</dd>
                </div>
              ) : null}
              {tarif.laufzeitMonate ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">{t.laufzeit}</dt>
                  <dd>{satz(t.monate, { anzahl: tarif.laufzeitMonate })}</dd>
                </div>
              ) : null}
              {tarif.preisgarantieMonate ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">{t.preisgarantie}</dt>
                  <dd>{satz(t.monate, { anzahl: tarif.preisgarantieMonate })}</dd>
                </div>
              ) : null}
            </dl>
          </article>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-gradient px-4 py-3 text-white">
            <span className="text-2xl font-extrabold text-cyan-brand">{betrag}</span>
            <span className="text-sm leading-snug text-white/90">{satz(t.plusCashback, { betrag })}</span>
          </div>

          <button
            type="button"
            className={`${knopf} mt-6`}
            onClick={() => {
              setSchritt("person");
              nachOben();
            }}
          >
            {t.weiterAbschluss}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">{t.rechnungTipp}</p>
        </div>
      ) : null}

      {/* SCHRITT 3: Person */}
      {schritt === "person" ? (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            zuVertrag();
          }}
        >
          <button type="button" onClick={() => setSchritt("angebot")} className="inline-flex items-center gap-1 text-sm text-gray-500">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.zurueckTarif}
          </button>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-marine">{t.personTitel}</h2>
          <div className="mt-6 space-y-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-marine">{t.anrede}</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["Frau", "Herr"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={person.anrede === a}
                    onClick={() => setP("anrede", a)}
                    className={`rounded-xl border py-3 text-marine ${
                      person.anrede === a ? "border-violet-brand bg-violet-brand/5" : "border-gray-200 bg-white"
                    }`}
                  >
                    {a === "Frau" ? t.frau : t.herr}
                  </button>
                ))}
              </div>
              {fehler.anrede ? <span className="mt-1 block text-sm text-red-700">{fm(fehler.anrede)}</span> : null}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feld label={t.vorname} fehler={fm(fehler.vorname)}>
                <input className={input} autoComplete="given-name" value={person.vorname} onChange={(e) => setP("vorname", e.target.value)} />
              </Feld>
              <Feld label={t.nachname} fehler={fm(fehler.nachname)}>
                <input className={input} autoComplete="family-name" value={person.nachname} onChange={(e) => setP("nachname", e.target.value)} />
              </Feld>
            </div>
            <Feld label={t.geburtstag} fehler={fm(fehler.geburtstag)}>
              <input className={ltr} dir="ltr" type="date" autoComplete="bday" value={person.geburtstag} onChange={(e) => setP("geburtstag", e.target.value)} />
            </Feld>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feld label={t.email} fehler={fm(fehler.email)}>
                <input className={ltr} dir="ltr" type="email" inputMode="email" autoComplete="email" value={person.email} onChange={(e) => setP("email", e.target.value)} />
              </Feld>
              <Feld label={t.telefon} fehler={fm(fehler.telefon)}>
                <input className={ltr} dir="ltr" type="tel" inputMode="tel" autoComplete="tel" value={person.telefon} onChange={(e) => setP("telefon", e.target.value)} />
              </Feld>
            </div>
            <div className="grid grid-cols-[1fr_6.5rem] gap-3">
              <Feld label={t.strasse} fehler={fm(fehler.strasse)}>
                <input className={input} autoComplete="address-line1" value={person.strasse} onChange={(e) => setP("strasse", e.target.value)} />
              </Feld>
              <Feld label={t.hausnummer} fehler={fm(fehler.hausnummer)}>
                <input className={ltr} dir="ltr" value={person.hausnummer} onChange={(e) => setP("hausnummer", e.target.value)} />
              </Feld>
            </div>
            <div className="grid grid-cols-[7.5rem_1fr] gap-3">
              <Feld label={t.plz}>
                <input className={`${ltr} bg-gray-50 text-gray-500`} dir="ltr" value={plz} readOnly />
              </Feld>
              <Feld label={t.ort} fehler={fm(fehler.ort)}>
                <input className={input} autoComplete="address-level2" value={person.ort} onChange={(e) => setP("ort", e.target.value)} />
              </Feld>
            </div>
          </div>
          <button type="submit" className={`${knopf} mt-7`}>
            {t.weiterZaehler}
          </button>
        </form>
      ) : null}

      {/* SCHRITT 4: Zähler, Konto, Bestellung */}
      {schritt === "vertrag" && tarif ? (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void bestellen();
          }}
        >
          <button type="button" onClick={() => setSchritt("person")} className="inline-flex items-center gap-1 text-sm text-gray-500">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.zurueck}
          </button>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-marine">{t.zaehlerTitel}</h2>
          <p className="mt-2 rounded-xl bg-cyan-brand/10 px-3 py-2 text-sm text-marine">{t.rechnungTipp}</p>

          <div className="mt-6 space-y-4">
            <Feld label={t.zaehlernummer} fehler={fm(fehler.zaehlernummer)} hilfe={t.zaehlerHilfe}>
              <input className={ltr} dir="ltr" autoComplete="off" value={person.zaehlernummer} onChange={(e) => setP("zaehlernummer", e.target.value)} />
            </Feld>
            <Feld label={t.vorversorger} fehler={fm(fehler.vorversorger)} hilfe={t.vorversorgerHilfe}>
              <input className={input} value={person.vorversorger} onChange={(e) => setP("vorversorger", e.target.value)} />
            </Feld>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feld label={t.maloLabel} fehler={fm(fehler.marktlokation)} hilfe={t.maloHilfe}>
                <input className={ltr} dir="ltr" inputMode="numeric" value={person.marktlokation} onChange={(e) => setP("marktlokation", e.target.value)} />
              </Feld>
              <Feld label={t.kundennummerLabel}>
                <input className={ltr} dir="ltr" value={person.kundennummer} onChange={(e) => setP("kundennummer", e.target.value)} />
              </Feld>
            </div>
            <Feld label={t.iban} fehler={fm(fehler.iban)} hilfe={t.ibanHilfe}>
              <input
                className={ltr}
                dir="ltr"
                autoComplete="off"
                spellCheck={false}
                placeholder="DE00 0000 0000 0000 0000 00"
                value={person.iban}
                onChange={(e) => setP("iban", e.target.value.toUpperCase())}
              />
            </Feld>
            <Feld label={t.kontoinhaber} fehler={fm(fehler.kontoinhaber)}>
              <input className={input} value={person.kontoinhaber} onChange={(e) => setP("kontoinhaber", e.target.value)} />
            </Feld>
          </div>

          {/* Honeypot, für Menschen unsichtbar */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            value={honig}
            onChange={(e) => setHonig(e.target.value)}
          />

          <section className="mt-7 rounded-2xl bg-surface p-5 text-sm">
            <h3 className="font-bold text-marine">{t.zusammenfassung}</h3>
            <dl className="mt-3 space-y-1.5">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.tarif}</dt>
                <dd className="text-end font-medium">
                  {anbieter} {tarifName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.arbeitspreis}</dt>
                <dd dir="ltr">{z.ct.format(tarif.arbeitspreisCt)} ct/kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.grundpreis}</dt>
                <dd dir="ltr">
                  {z.euro.format(tarif.grundpreisEurJahr)} {t.proJahr}
                </dd>
              </div>
              {tarif.bonusEur > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">{t.bonus}</dt>
                  <dd dir="ltr">{z.euro.format(tarif.bonusEur)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.verbrauch}</dt>
                <dd dir="ltr">{z.kwh.format(kwh)} kWh</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t.lieferstelle}</dt>
                <dd className="text-end">
                  {person.strasse} {person.hausnummer}, {plz} {person.ort}
                </dd>
              </div>
            </dl>
          </section>

          <div className="mt-5 space-y-3">
            <Haken
              checked={zustimmung.bestellung}
              onChange={(v) => setZustimmung((s) => ({ ...s, bestellung: v }))}
              fehler={fm(fehler.bestellung)}
            >
              {satz(t.zustimmungBestellung, { tarif: tarifName, anbieter })}
            </Haken>
            <Haken
              checked={zustimmung.datenschutz}
              onChange={(v) => setZustimmung((s) => ({ ...s, datenschutz: v }))}
              fehler={fm(fehler.datenschutz)}
            >
              {t.zustimmungDatenschutz}{" "}
              <a href="/datenschutz" target="_blank" className="text-violet-brand underline">
                {t.datenschutzLink}
              </a>
            </Haken>
            <Haken
              checked={zustimmung.cashback}
              onChange={(v) => setZustimmung((s) => ({ ...s, cashback: v }))}
              fehler={fm(fehler.cashback)}
            >
              {t.zustimmungCashback}{" "}
              <a href="#bedingungen" className="text-violet-brand underline">
                {t.bedingungenLink}
              </a>
            </Haken>
          </div>

          {sendeFehler ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{sendeFehler}</p> : null}

          <button type="submit" className={`${knopf} mt-6`} disabled={sendet}>
            {sendet ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {sendet ? t.sendet : t.bestellen}
          </button>
          <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 shrink-0" /> {t.widerruf}
          </p>
          {sprache !== "de" ? <p className="mt-1 text-center text-xs text-gray-500">{t.vertragDeutsch}</p> : null}
        </form>
      ) : null}

      {/* FERTIG */}
      {schritt === "fertig" ? (
        <div className="mt-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-brand/20">
            <Check className="h-6 w-6 text-marine" strokeWidth={3} />
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-marine">{t.fertigTitel}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{satz(t.fertigText, { vorgang })}</p>
          <ol className="mt-6 space-y-3">
            {t.fertigSchritte.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-brand/10 text-sm font-bold text-violet-brand">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[15px] leading-relaxed text-marine">{satz(s, { anbieter, betrag })}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
