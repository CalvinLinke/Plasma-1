# Plasma Energie – Lead-Magneten (helle CI)

14 druckoptimierte Vorlagen im neuen hellen Plasma-Look. **Drop-in-fertig** für die bestehende Next.js-Website.

## 1:1-Umsetzung (für Claude Code)

Der Ordner `public/downloads/` in diesem Paket **spiegelt exakt** das Zielverzeichnis der Website.
Alle Dateinamen entsprechen den bereits verdrahteten Download-Buttons und der `/vorlagen`-Bibliothek.

**Deploy = Ordnerinhalt kopieren:**

```
cp -r public/downloads/*  <WEBSITE>/public/downloads/
```

Damit werden die 14 bestehenden Platzhalter-Assets überschrieben. Es sind **keine Code-Änderungen**
nötig – die Zielseiten referenzieren dieselben Pfade. Neu ist lediglich `logo-plasma.png`
(identisch mit `public/Logo Plasma.png`, hier lokal eingebunden, damit die HTML-Dateien offline stimmen).

> Hinweis: `_vorschau/index.html` ist nur eine Galerie zur Durchsicht und gehört **nicht** ins Deployment.

## Design / CI

- **Hell & freundlich:** weißes Blatt, weiße Kopfzeile mit dezentem Violett-Tint (`#F5F2FF`), oben schlanke Gradient-Leiste (`Indigo → Violett → Cyan`). Branding erkennbar, aber druckschonend (kaum Farbflächen).
- **Farben:** Marine `#1A1B4B`, Indigo `#4B0082`, Violett `#7B61FF`, Cyan `#00F0FF`.
- **Logo:** echtes Firmenlogo (`logo-plasma.png`), Höhe 34 px in der Kopfzeile.
- **Schrift:** Inter (Google Fonts eingebunden), Fallback System-Sans.
- **Format:** A4, `@media print` sauber (Schatten/Ränder entfernt, `print-color-adjust:exact` für die dezenten Tints). Druck-Ausrichtung ist je Vorlage über `@page{ size:... }` **fest hinterlegt** – bitte 1:1 übernehmen:
  - **Querformat (A4 landscape):** Nr. 10 `gewerbe-energiekosten-check.html` und Nr. 11 `wg-stromkosten-aufteilung.html` (breite Tabellen).
  - **Hochformat (A4 portrait):** alle übrigen 12 Vorlagen (Nr. 14 `verbrauchs-tagebuch.html` ist eine hohe Hochformat-Tabelle).
- **Tonalität:** Sie-Form, sachlich-freundlich, **keine Gedankenstriche** im Fließtext.
- **Fuß:** NAP-Zeile. Musterbriefe zusätzlich: „Unverbindliche Muster-Vorlage, keine Rechtsberatung."
- **CTA:** dezente Verlaufsbox mit Button → `plasma-energie.de/angebot-erhalten`.
- **Platzhalter** in Briefen: dezent violett hinterlegt (`.ph`).

## Die 14 Vorlagen

| # | Datei (`public/downloads/…`) | Titel | Typ | Zielseite |
|---|---|---|---|---|
| 01 | umzugs-checkliste-energie.html | Umzugs-Checkliste: Strom & Gas | Checkliste | /wechseln/umzug-strom-gas-ummelden |
| 02 | uebergabeprotokoll-zaehlerstaende.html | Übergabeprotokoll Zählerstände | Formular | /ratgeber/zaehlerstand-ablesen-uebergabe |
| 03 | kuendigung-strom-gas-vorlage.html | Kündigung Strom & Gas | Musterbrief | /ratgeber/stromvertrag-kuendigen-fristen |
| 04 | widerspruch-preiserhoehung.html | Widerspruch Preiserhöhung | Musterbrief | /wechseln/preiserhoehung-anbieter-wechseln |
| 05 | sonderkuendigung-strom-gas.html | Sonderkündigung (Preiserhöhung/Umzug) | Musterbrief | /vorlagen |
| 06 | vollmacht-anbieterwechsel.html | Vollmacht Anbieterummeldung | Vollmacht | /ratgeber/stromanbieter-wechseln |
| 07 | stromrechnung-pruefen-checkliste.html | Stromrechnung in 5 Minuten prüfen | Checkliste | /ratgeber/energiepreise-verstehen |
| 08 | widerspruch-jahresabrechnung.html | Widerspruch Jahresabrechnung | Prüfhilfe + Brief | /ratgeber/abschlag-nachzahlung-verstehen |
| 09 | abschlag-anpassen-vorlage.html | Abschlag anpassen | Musterbrief | /vorlagen |
| 10 | gewerbe-energiekosten-check.html | Gewerbe-Energiekosten-Check | Tabelle | /tarife/gewerbestrom |
| 11 | wg-stromkosten-aufteilung.html | WG-Stromkosten aufteilen | Tabelle | /wechseln/wg-gruendung-strom-anmelden |
| 12 | oekostrom-siegel-spickzettel.html | Echten Ökostrom erkennen | Spickzettel | /tarife/oekostrom |
| 13 | erste-wohnung-energie-starterpaket.html | Erste eigene Wohnung | Guide + Checkliste | /wechseln/erste-eigene-wohnung-strom-anmelden |
| 14 | verbrauchs-tagebuch.html | Verbrauchs-Tagebuch | Tabelle | /ratgeber/strom-sparen-haushalt |

## Tabellen-Daten (Excel) – Nr. 10, 11, 14

Liegen als **`.csv`** bei (Semikolon-getrennt, UTF-8 mit BOM → öffnen in deutschem Excel direkt korrekt):
`gewerbe-energiekosten-check.csv`, `wg-stromkosten-aufteilung.csv`, `verbrauchs-tagebuch.csv`.

Spaltenstruktur = identisch zur jeweiligen HTML-Vorlage. So bereitstellen:

1. **Als HTML-Vorlage** (Standard): bleibt wie verdrahtet.
2. **Als Excel-Download** (optional): CSV in Excel öffnen, als `.xlsx` mit **gleichem Dateinamen** speichern, in `public/downloads/` ablegen und in der Zielseite `lead_magnet_file` auf die `.xlsx` umstellen. Auto-Summe (`=SUMME(...)`) kann in der Summenzeile ergänzt werden.

## Screenshots

Nicht beigelegt – die HTML-Dateien sind die Quelle der Wahrheit und in jedem Browser 1:1 druckbar. `_vorschau/index.html` zeigt alle 14 als Live-Vorschau.

## Ordnerstruktur dieses Pakets

```
plasma-leadmagneten/
├─ README.md
├─ public/
│  └─ downloads/            ← 1:1 in die Website kopieren
│     ├─ logo-plasma.png
│     ├─ <14 Vorlagen>.html   (10 + 11 = A4 quer, Rest hoch)
│     └─ *.csv                (Excel-Daten für 10, 11, 14)
└─ _vorschau/
   └─ index.html            ← nur Review-Galerie, nicht deployen
```
