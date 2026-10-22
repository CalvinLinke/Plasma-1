// PROTOTYP. Beispieldaten, damit der Ablauf klickbar ist.
// Keine Live-Abfrage beim Partner-Portal, kein Auftrag an die Neue-Energie-API.

export const PROTOTYP_MIN_PROVISION_EUR = 80;

export const HAUSHALTE = [
  { id: "1", label: "1", kwh: 1000 },
  { id: "2", label: "2", kwh: 2000 },
  { id: "3", label: "3", kwh: 3000 },
  { id: "4", label: "4", kwh: 4000 },
] as const;

export type BeispielTarif = {
  id: string;
  anbieter: string;
  name: string;
  arbeitspreisCt: number;
  grundpreisEurJahr: number;
  bonusEur: number;
  provisionNachBonusEur: number;
  laufzeitMonate: number;
};

// Preise sind erfunden, bis auf Arbeitspreis, Grundpreis und Provision von
// "Ideal": die stammen aus dem Laura-Lauf (1.000 kWh, 01067). Hier werden sie
// auf jeden Verbrauch gerechnet, deshalb nicht als Live-Preis verwenden.
export const BEISPIEL_TARIFE: BeispielTarif[] = [
  {
    id: "spar-direkt",
    anbieter: "Sparstrom Direkt",
    name: "Online 12",
    arbeitspreisCt: 29.9,
    grundpreisEurJahr: 70,
    bonusEur: 150,
    provisionNachBonusEur: 40,
    laufzeitMonate: 12,
  },
  {
    id: "klarwerk",
    anbieter: "Klarwerk",
    name: "Haushalt",
    arbeitspreisCt: 32.1,
    grundpreisEurJahr: 120,
    bonusEur: 0,
    provisionNachBonusEur: 95,
    laufzeitMonate: 12,
  },
  {
    id: "gruenwerk",
    anbieter: "Grünwerk",
    name: "Natur",
    arbeitspreisCt: 36.8,
    grundpreisEurJahr: 84,
    bonusEur: 0,
    provisionNachBonusEur: 110,
    laufzeitMonate: 12,
  },
  {
    id: "ideal",
    anbieter: "Beispielenergie",
    name: "Ideal",
    arbeitspreisCt: 34.42,
    grundpreisEurJahr: 92.64,
    bonusEur: 50,
    provisionNachBonusEur: 68,
    laufzeitMonate: 12,
  },
  {
    id: "hausstrom-plus",
    anbieter: "Hausstrom",
    name: "Plus",
    arbeitspreisCt: 38.5,
    grundpreisEurJahr: 140,
    bonusEur: 0,
    provisionNachBonusEur: 130,
    laufzeitMonate: 12,
  },
];

export type TarifGrund = "unter" | "guenstigster" | "teurer";

export type GepruefterTarif = BeispielTarif & {
  jahreskostenEur: number;
  behalten: boolean;
  grund: TarifGrund;
};

export type Tarifwahl = {
  verbrauchKwh: number;
  mindestprovisionEur: number;
  geprueft: GepruefterTarif[];
  gewinner: GepruefterTarif | null;
};

function euro(wert: number): number {
  return Math.round(wert * 100) / 100;
}

export function jahreskosten(tarif: BeispielTarif, verbrauchKwh: number): number {
  return euro(tarif.grundpreisEurJahr + (tarif.arbeitspreisCt / 100) * verbrauchKwh - tarif.bonusEur);
}

export function waehleTarif(verbrauchKwh: number, mindestprovisionEur: number): Tarifwahl {
  const bewertet = BEISPIEL_TARIFE.map((tarif) => {
    const kosten = jahreskosten(tarif, verbrauchKwh);
    const behalten = tarif.provisionNachBonusEur >= mindestprovisionEur;
    return { tarif, kosten, behalten };
  });

  const guenstigster = bewertet
    .filter((eintrag) => eintrag.behalten)
    .sort((a, b) => a.kosten - b.kosten)[0];
  const gewinnerId = guenstigster?.tarif.id ?? null;

  const geprueft = bewertet
    .map(({ tarif, kosten, behalten }) => {
      const istGewinner = gewinnerId === tarif.id;
      let grund: TarifGrund;
      if (!behalten) grund = "unter";
      else if (istGewinner) grund = "guenstigster";
      else grund = "teurer";
      return { ...tarif, jahreskostenEur: kosten, behalten, grund };
    })
    .sort((a, b) => a.jahreskostenEur - b.jahreskostenEur);

  return {
    verbrauchKwh,
    mindestprovisionEur,
    geprueft,
    gewinner: geprueft.find((tarif) => tarif.id === gewinnerId) ?? null,
  };
}

export type AuftragPerson = {
  anrede: string;
  vorname: string;
  nachname: string;
  geburtstag: string;
  email: string;
  telefon: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  zaehlernummer: string;
  vorversorger: string;
  iban: string;
  kontoinhaber: string;
};

export function auftragEntwurf(
  wahl: Tarifwahl,
  person: AuftragPerson,
  externalId: string,
): Record<string, string> {
  const tarif = wahl.gewinner;
  return {
    testMode: "1",
    tariffId: tarif?.id ?? "",
    tariffName: tarif ? `${tarif.anbieter} ${tarif.name}` : "",
    type: "type_changing_provider",
    appointment: "appointment_next_possible",
    consumption: String(wahl.verbrauchKwh),
    zip: person.plz,
    city: person.ort,
    street: person.strasse,
    houseNumber: person.hausnummer,
    salutation: person.anrede,
    firstname: person.vorname,
    lastname: person.nachname,
    birthday: person.geburtstag,
    email: person.email,
    phone: person.telefon,
    meterNumber: person.zaehlernummer,
    currentProviderName: person.vorversorger,
    iban: person.iban.replace(/\s/g, ""),
    accountHolder: person.kontoinhaber,
    externalId,
    hinweis: "Prototyp. Dieser Body wurde nicht an Neue Energie gesendet.",
  };
}
