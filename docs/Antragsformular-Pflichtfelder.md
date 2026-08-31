# Antragsformular — Pflichtfelder (Referenz GFU)

**Quelle:** [esveo/gfu-website](https://github.com/esveo/gfu-website) · `src/app/SignupForm.tsx`  
**Stand:** Ausgelesen aus dem Repo (React Hook Form `rules`, Stand Branch `main`).  
**Zweck in Plasma:** Checkliste, welche Daten für einen **vollständigen Stromvertragsantrag** nötig sind — und wie sie in Notion **Partner-Anfragen** landen sollen.

Das GFU-Formular ist **kein Stepper**, sondern **eine Seite** mit logischen Blöcken (`FieldGroup`):

1. Verbrauch & Lieferbeginn  
2. Lieferadresse  
3. Vertragspartner  
4. Rechnungsversand & Rechnungsadresse  
5. Zählernummer  
6. Bankverbindung  
7. Datenschutz & Absenden  

---

## Immer Pflicht (Standardfall)

Diese Felder haben `rules: { required: true }` im Formular.

| GFU-Feld | Label im Formular | Notion-Spalte (Partner-Anfragen) | Plasma-Quelle heute |
|---|---|---|---|
| `consumption` | Jahresverbrauch in kWh | `Verbrauch kWh` | Rechnungsanalyse (PDF) |
| `appointmentDate` | Datum des Lieferbeginns | `Lieferbeginn` | — |
| `zip` | PLZ (Lieferadresse) | `PLZ` | Formular / Rechnung |
| `street` | Straße und Hausnummer (Suchfeld) | `Straße` | Rechnungsanalyse (PDF) |
| `salutation` | Anrede | `Anrede` | — |
| `firstname` | Vorname | `Vorname` | E-Mail / Formular |
| `lastname` | Nachname | `Nachname` | E-Mail / Formular |
| `birthday` | Geburtsdatum | `Geburtsdatum` | — |
| `phoneCode` | Vorwahl | `Telefon` (kombiniert) | E-Mail (optional) |
| `phone` | Rufnummer | `Telefon` (kombiniert) | E-Mail |
| `meterNumber` | Nummer des neuen Stromzählers | `Zählernummer` | Rechnungsanalyse (PDF) |
| `privacyAccepted` | Datenschutz-Checkbox | — (Nachweis in E-Mail) | Website-Opt-in |

### Lieferadresse — implizit Pflicht

`city` und `houseNumber` haben **kein eigenes `required`**, werden aber über die **Adresssuche** (`AddressSearch`) gesetzt, sobald Straße + PLZ gewählt sind. Ohne gültige Adresse schlägt die **Tarifprüfung** (`validateAdress`) fehl.

| GFU-Feld | Label | Notion | Plasma-Quelle heute |
|---|---|---|---|
| `houseNumber` | (Teil der Adresssuche) | `Hausnummer` | Rechnungsanalyse (PDF) |
| `city` | (Teil der Adresssuche) | `Ort` | Formular / Rechnung |

### Bankverbindung — Standard: Lastschrift

Default ist **Lastschrift** (`individualPayment: false`). Dann Pflicht:

| GFU-Feld | Label | Notion | Plasma-Quelle heute |
|---|---|---|---|
| `accountHolder` | Kontoinhaber | `Kontoinhaber` | Rechnungsanalyse (PDF, falls vorhanden) |
| `iban` | IBAN | `IBAN` | Rechnungsanalyse (PDF, falls vorhanden) |

Bei **Selbstzahlung** (`individualPayment: true`) entfallen Kontoinhaber und IBAN.

---

## Bedingt Pflicht

| Bedingung | GFU-Felder | Label | Notion |
|---|---|---|---|
| Rechnungsversand = E-Mail (`accountDelivery === "account_delivery_email"`, **Default**) | `email` | E-Mail | `E-Mail` |
| Rechnungsversand = Post | `email` | E-Mail | optional (nur Format-Check) |
| Zweiter Vertragspartner (`secondOwner === true`) | `secondOwnerSalutation`, `secondOwnerFirstname`, `secondOwnerLastname`, `secondOwnerBirthday` | Anrede, Vorname, Nachname, Geburtsdatum (2. Inhaber) | — (noch keine Spalten) |
| Abweichende Rechnungsadresse (`billing === true`) | `billingSalutation`, `billingFirstname`, `billingLastname`, `billingStreet`, `billingHouseNumber`, `billingZip`, `billingCity` | Rechnungsadresse komplett | — (noch keine Spalten) |
| Abweichende Rechnungsadresse | `billingEmail`, `billingPhoneCode`, `billingPhone` | optional (nur Format, wenn ausgefüllt) | — |

**Default-Rechnungsadresse:** identisch mit Lieferadresse (`billing: false`).

---

## Vom System befüllt (kein Nutzer-Input)

| GFU-Feld | Bedeutung | Notion |
|---|---|---|
| `basePrice` | Grundpreis (Cent/Jahr) nach Tarifprüfung | `Grundpreis €/Jahr` |
| `workingPrice` | Arbeitspreis (Cent/kWh) nach Tarifprüfung | `Arbeitspreis ct/kWh` |
| `neueEnergieAddressValidationError` | Fehlertext Tarifprüfung | — |
| `ref` | Kampagnen-Referenz (URL-Parameter) | — |

Tarifpreise können alternativ aus der **Rechnungsanalyse** kommen (`Anbieter`, `Tarif`, `Arbeitspreis`, `Grundpreis`).

---

## Minimal-Checkliste für „Antrag vollständig“

Für den **Standardfall** (1 Vertragspartner, Rechnungsadresse = Lieferadresse, Lastschrift, Rechnung per E-Mail):

- [ ] Jahresverbrauch (kWh)  
- [ ] Lieferbeginn (Datum)  
- [ ] Lieferadresse: PLZ, Straße, Hausnummer, Ort  
- [ ] Anrede, Vorname, Nachname, Geburtsdatum  
- [ ] E-Mail, Telefon (Vorwahl + Rufnummer)  
- [ ] Zählernummer  
- [ ] Kontoinhaber, IBAN  
- [ ] Datenschutz-Einwilligung  

---

## Abgleich: Website `/tonym` vs. GFU-Antrag

Die Partner-Landingpage [`components/TonyMForm.tsx`](../components/TonyMForm.tsx) erhebt **nur**:

| Feld | Pflicht auf `/tonym` |
|---|---|
| Vorname, Nachname | ja |
| E-Mail | ja |
| Telefon | nein |
| PLZ / Wohnort | ja (als Anmerkung in der E-Mail) |
| Rechnung (Upload) | nein (empfohlen) |
| Datenschutz | ja |

→ Für einen GFU-kompatiblen Antrag fehlen dort **noch** u. a. Straße, Hausnummer, Geburtsdatum, Anrede, Lieferbeginn, Zählernummer, IBAN.

---

## Abgleich: Automatische Pipeline (Partner-Mails → Notion)

Cron: [`/api/process-partner-mails`](../app/api/process-partner-mails/route.ts)

| Daten | Quelle | Status |
|---|---|---|
| Name, E-Mail, Telefon, PLZ/Ort | Partner-E-Mail | aktiv |
| Straße, Hausnummer, IBAN, Kontoinhaber | Rechnungs-PDF (`lib/invoice-parse.ts`) | aktiv (PDF mit Text) |
| Anbieter, Tarif, Verbrauch, Zählernummer, Preise | Rechnungs-PDF | aktiv |
| Geburtsdatum, Anrede, Lieferbeginn | — | Spalten in Notion, **noch keine Quelle** |
| Foto-Rechnung ohne Text | — | `Analyse-Status: Bild ohne OCR` |

---

## Notion-Datenbank **Partner-Anfragen**

Relevante Spalten (siehe [`lib/notion-leads.ts`](../lib/notion-leads.ts)):

**Kontakt & Antrag:** Name, Vorname, Nachname, E-Mail, Telefon, Anrede, Geburtsdatum, PLZ, Ort, Straße, Hausnummer, IBAN, Kontoinhaber, Lieferbeginn  

**Rechnung & Analyse:** Anbieter, Energieart, Tarif, Kundennummer, Zählernummer, Verbrauch kWh, Arbeitspreis, Grundpreis, Rechnungsbetrag, Analyse-Status  

**Meta:** Partner, Eingang, Status, Graph-Message-ID, Rechnung, Rechnung-URL  

---

## Pflege-Hinweis

Bei Änderungen am GFU-Formular erneut prüfen:

```bash
gh api repos/esveo/gfu-website/contents/src/app/SignupForm.tsx --jq '.content' | base64 -d | rg 'rules:\s*\{\s*required'
```

Server-Schema (Zod, alle Keys, ohne optionale Feinheiten): `src/app/submitHelpers.ts` → `signUpFormInputSchema`.
