// Ermittelt das Angebot für die Cashback-Strecke.
//
// Quelle: Tarifrechner im Neue-Energie-Partner-Portal. Nur dort gibt es Preis,
// Bonus UND Provision in einem Abruf (die external_api kennt keine Provision,
// siehe docs/Partner-Tarifpruefung.md). Ausgewählt wird der günstigste Tarif,
// dessen Provision die Mindestschwelle erreicht. Der Kunde sieht die Provision
// nie; sie reist verschlüsselt im Angebots-Token mit (lib/cashback/siegel.ts).

import {
  buildCalculatorSubmit,
  decodePortalTariffs,
  loadPortalConfig,
  loginNeueEnergiePortal,
  portalGet,
  portalPost,
  toJqueryForm,
} from "@/lib/neue-energie-portal";
import { BEISPIEL_TARIFE } from "@/lib/prototyp-wechsel";
import { cashbackConfig } from "@/lib/cashback/config";

/** Was der Kunde sieht. */
export type KundenTarif = {
  anbieter: string;
  name: string;
  arbeitspreisCt: number;
  grundpreisEurJahr: number;
  bonusEur: number;
  /** Kosten im ersten Jahr, Bonus bereits abgezogen. */
  jahreskostenEur: number;
  /** Monatlicher Abschlag ohne Bonus. */
  abschlagEur: number;
  laufzeitMonate?: number;
  preisgarantieMonate?: number;
  oekostrom?: boolean;
};

/** Intern, nur verschlüsselt im Browser. */
export type InternesAngebot = KundenTarif & {
  tariffId: string;
  provisionEur: number;
  quelle: "portal" | "demo";
  plz: string;
  ort: string;
  kwh: number;
};

export type AngebotErgebnis =
  | { status: "ok"; angebot: InternesAngebot; geprueft: number }
  | { status: "keinTarif"; geprueft: number }
  | { status: "fehler"; grund: string };

type Kandidat = Omit<InternesAngebot, "plz" | "ort" | "kwh" | "quelle" | "jahreskostenEur" | "abschlagEur">;

function rund(wert: number): number {
  return Math.round(wert * 100) / 100;
}

function zahl(...werte: unknown[]): number | undefined {
  for (const wert of werte) {
    if (typeof wert === "number" && Number.isFinite(wert)) return wert;
    if (typeof wert === "string" && wert.trim() !== "") {
      const n = Number.parseFloat(wert.replace(",", "."));
      if (Number.isFinite(n)) return n;
    }
    if (wert && typeof wert === "object" && "cost" in (wert as Record<string, unknown>)) {
      const n = zahl((wert as Record<string, unknown>).cost);
      if (n !== undefined) return n;
    }
  }
  return undefined;
}

function text(...werte: unknown[]): string | undefined {
  for (const wert of werte) {
    if (typeof wert === "string" && wert.trim()) return wert.trim();
    if (typeof wert === "number") return String(wert);
  }
  return undefined;
}

function obj(wert: unknown): Record<string, unknown> {
  return wert && typeof wert === "object" ? (wert as Record<string, unknown>) : {};
}

/**
 * Liest einen Tarif aus der Portal-Antwort. Die Feldnamen sind aus Roberts
 * Referenzlauf (scripts/ne-portal-laura.mts) übernommen und defensiv gehalten:
 * Fehlt Preis, ID oder Provision, wird der Tarif verworfen.
 */
export function portalTarifLesen(roh: unknown): Kandidat | null {
  const r = obj(roh);
  const nested = obj(r.futuramaTariff);
  const calc = Object.keys(obj(r.calculator)).length ? obj(r.calculator) : obj(nested.calculator);
  const company = obj(r.company ?? nested.company);

  const tariffId = text(r.tariffId, r.id, nested.id);
  const arbeitspreisCt = zahl(calc.workingPrice, nested.workingPrice, r.workingPrice);
  const grundpreisEurJahr = zahl(calc.basePrice, nested.basePrice, r.basePrice);
  const provisionEur = zahl(nested.provision, r.provision);
  if (!tariffId || arbeitspreisCt === undefined || grundpreisEurJahr === undefined || provisionEur === undefined) {
    return null;
  }

  return {
    tariffId,
    anbieter:
      text(r.providerName, nested.providerName, r.companyName, nested.companyName, company.name) ?? "Versorger",
    name: text(r.name, nested.name, r.tariffName) ?? "Stromtarif",
    arbeitspreisCt,
    grundpreisEurJahr,
    bonusEur: zahl(calc.bonus, nested.bonus, r.bonus) ?? 0,
    provisionEur,
    laufzeitMonate: zahl(r.contractDuration, nested.contractDuration, r.minimumTerm, nested.minimumTerm, r.duration),
    preisgarantieMonate: zahl(r.priceGuarantee, nested.priceGuarantee, r.priceGuaranteeMonths),
    oekostrom: Boolean(r.eco ?? nested.eco ?? r.isEco ?? nested.isEco ?? false) || undefined,
  };
}

export function waehle(
  kandidaten: Kandidat[],
  eingabe: { plz: string; ort: string; kwh: number },
  quelle: InternesAngebot["quelle"],
): AngebotErgebnis {
  const { mindestProvisionEur } = cashbackConfig();
  const bewertet = kandidaten
    .filter((k) => k.provisionEur >= mindestProvisionEur)
    .map((k) => {
      const ohneBonus = k.grundpreisEurJahr + (k.arbeitspreisCt / 100) * eingabe.kwh;
      return {
        ...k,
        ...eingabe,
        quelle,
        jahreskostenEur: rund(ohneBonus - k.bonusEur),
        abschlagEur: rund(ohneBonus / 12),
      };
    })
    .sort((a, b) => a.jahreskostenEur - b.jahreskostenEur);

  const bester = bewertet[0];
  if (!bester) return { status: "keinTarif", geprueft: kandidaten.length };
  return { status: "ok", angebot: bester, geprueft: kandidaten.length };
}

function demoKandidaten(): Kandidat[] {
  return BEISPIEL_TARIFE.map((t) => ({
    tariffId: `demo-${t.id}`,
    anbieter: t.anbieter,
    name: t.name,
    arbeitspreisCt: t.arbeitspreisCt,
    grundpreisEurJahr: t.grundpreisEurJahr,
    bonusEur: t.bonusEur,
    provisionEur: t.provisionNachBonusEur,
    laufzeitMonate: t.laufzeitMonate,
  }));
}

async function portalKandidaten(eingabe: { plz: string; ort: string; kwh: number }): Promise<Kandidat[] | string> {
  const config = loadPortalConfig();
  if ("error" in config) return "Partner-Login für Neue Energie fehlt (NEUE_ENERGIE_PORTAL_USER/PASSWORD)";

  const login = await loginNeueEnergiePortal(config);
  if (!login.ok) return login.error;

  const modelle = await portalGet(
    config,
    login.session,
    "/partner-area/calculator/load-models?appCase=CASE_CREATE&copied=false",
    true,
  );
  const calculatorModel = obj(obj(modelle.body).calculatorModel);
  const submit = buildCalculatorSubmit(
    {
      zip: eingabe.plz,
      city: eingabe.ort,
      street: "",
      houseNumber: "",
      consumptionKwh: eingabe.kwh,
      energyType: "electro",
      customerType: "client_type_private",
      contractType: "type_changing_provider",
    },
    calculatorModel,
  );
  const antwort = await portalPost(
    config,
    login.session,
    "/partner-area/calculator/tariffs",
    toJqueryForm({ calculator: submit }),
  );
  if (antwort.status >= 400) return `Tarifrechner antwortet mit HTTP ${antwort.status}`;
  const tarife = decodePortalTariffs(antwort.body);
  if (!tarife) return "Tarifrechner liefert keine lesbaren Tarife";
  return tarife.map(portalTarifLesen).filter((k): k is Kandidat => k !== null);
}

// Kurzer Zwischenspeicher pro Serverless-Instanz, damit nicht jeder Klick
// einen Portal-Login auslöst.
const cache = new Map<string, { bis: number; kandidaten: Kandidat[] }>();
const CACHE_MS = 30 * 60 * 1000;

export async function angebotErmitteln(eingabe: { plz: string; ort: string; kwh: number }): Promise<AngebotErgebnis> {
  if (cashbackConfig().demo) return waehle(demoKandidaten(), eingabe, "demo");

  const key = `${eingabe.plz}|${eingabe.ort.toLowerCase()}|${eingabe.kwh}`;
  const treffer = cache.get(key);
  if (treffer && treffer.bis > Date.now()) return waehle(treffer.kandidaten, eingabe, "portal");

  let kandidaten: Kandidat[] | string;
  try {
    kandidaten = await portalKandidaten(eingabe);
  } catch (error) {
    kandidaten = error instanceof Error ? error.message : "Unbekannter Fehler beim Tarifrechner";
  }
  if (typeof kandidaten === "string") return { status: "fehler", grund: kandidaten };

  if (cache.size > 500) cache.clear();
  cache.set(key, { bis: Date.now() + CACHE_MS, kandidaten });
  return waehle(kandidaten, eingabe, "portal");
}

export function kundenSicht(a: InternesAngebot): KundenTarif {
  return {
    anbieter: a.anbieter,
    name: a.name,
    arbeitspreisCt: a.arbeitspreisCt,
    grundpreisEurJahr: a.grundpreisEurJahr,
    bonusEur: a.bonusEur,
    jahreskostenEur: a.jahreskostenEur,
    abschlagEur: a.abschlagEur,
    laufzeitMonate: a.laufzeitMonate,
    preisgarantieMonate: a.preisgarantieMonate,
    oekostrom: a.oekostrom,
  };
}
