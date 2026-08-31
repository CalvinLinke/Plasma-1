---
name: rechnungs-analyse
description: Analysiert Energierechnungen (PDF, Bilder, Office-Dateien) aus rechnungen/_input, schreibt pro Dokument eine Markdown-Analyse und befuellt die SQLite-Datenbank rechnungen/datenbank/rechnungen.db. Nutze diesen Skill, wenn Rechnungsdokumente analysiert, importiert, verarbeitet oder in die Rechnungsdatenbank aufgenommen werden sollen — z. B. "analysier die Rechnungen im Eingang", "verarbeite die hochgeladene Rechnung", "importier das PDF in die Datenbank".
---

# Rechnungs-Analyse (Plasma Energie Solution)

Portiert aus der Memory-Alpha-Engine (obsidian-importer). Verarbeitet Kundenrechnungen
(Strom/Gas) zu strukturierten Daten fuer die Angebotserstellung.

## Ablagestruktur

```text
rechnungen/
├── _input/       Eingang: neue, unverarbeitete PDFs/Bilder hier ablegen
├── dokumente/    verarbeitete Originale + je eine .md-Analyse daneben
└── datenbank/    rechnungen.db (SQLite) + rechnungen.json (Export)
```

Diese Ordner enthalten Kundendaten und sind per `.gitignore` von Git ausgeschlossen.
Niemals Rechnungsinhalte oder Kundendaten committen.

## Workflow

1. **Extrahieren** — Helper-Skript erzeugt `.content.md` neben jeder Datei im Eingang:

   ```bash
   python3 .claude/skills/rechnungs-analyse/scripts/extract.py --ocr-lang deu+eng
   ```

   PDFs: erst Textextraktion, bei zu wenig Text automatisch OCR (Tesseract).
   Bilder (JPG/PNG/HEIC-als-JPG): direkt OCR. Gezielte Wiederholung bei schwacher
   Qualitaet mit `--path "datei.pdf" --overwrite --force-ocr --ocr-dpi 300` (oder 400,
   zusaetzlich `--ocr-psm 6` bei Tabellenlayouts).

2. **Validieren** — Jede `.content.md` pruefen: deutsche Umlaute korrekt, Betraege,
   Zaehlernummern und Daten lesbar? Bei Gibberish gezielt mit anderen OCR-Parametern
   erneut extrahieren, bevor analysiert wird.

3. **Analysieren** — Aus dem validierten Text die Rechnungsdaten verstehen:
   Energieart, Anbieter, Tarif, Kunde, Verbrauch, Preise, Zeitraeume, Vertragsdetails.
   Bei Unsicherheit die Originaldatei direkt lesen (PDFs und Bilder koennen mit dem
   Read-Tool visuell geprueft werden — das ist bei Layout-lastigen Rechnungen oft
   zuverlaessiger als OCR-Text).

4. **Ablegen** — Original nach `rechnungen/dokumente/` verschieben, sprechender Name:
   `YYYY-MM-DD <Dokumenttyp> <Anbieter> <Energieart> <Kunde>.<ext>`
   (Datum = Rechnungsdatum). Beispiel: `2026-07-15 Rechnung Vattenfall Strom Mustermann.pdf`

5. **Analyse-Markdown** schreiben: gleicher Basisname mit `.md` neben dem Original
   (Format siehe unten). Danach die temporaere `.content.md` im Eingang loeschen.
   Leere Unterordner im Eingang loeschen, Top-Level-Ordner in `_input/` stehen lassen.

6. **Datenbank befuellen** — Datensatz als JSON an das DB-Skript geben:

   ```bash
   python3 .claude/skills/rechnungs-analyse/scripts/rechnungs_db.py upsert --json -
   ```

   (JSON-Objekt via stdin; Felder siehe `rechnungs_db.py`-Docstring bzw. Fehlermeldung.
   Schluessel ist `quelle_datei` — erneutes Verarbeiten aktualisiert den Datensatz.)

7. **Berichten** — was verarbeitet, uebersprungen oder blockiert wurde; danach
   optional `export` fuer den JSON-Abzug.

## Format der Analyse-Markdown

```markdown
---
dokumenttyp: rechnung
energieart: strom
kunde: Max Mustermann
anbieter: Vattenfall
rechnungsdatum: 2026-07-15
quelle: "2026-07-15 Rechnung Vattenfall Strom Mustermann.pdf"
analysiert_am: 2026-08-31
---

# Zusammenfassung

2–4 Saetze: Wer, welcher Anbieter/Tarif, Zeitraum, Verbrauch, Ergebnis
(Nachzahlung/Guthaben), neuer Abschlag.

# Eckdaten

| Feld | Wert |
|---|---|
| Verbrauch | 3.450 kWh |
| Arbeitspreis | 38,5 ct/kWh |
| Grundpreis | 156 €/Jahr |
| ... | ... |

# Auffaelligkeiten

- Fuer die Angebotserstellung relevante Beobachtungen: hoher Arbeitspreis,
  auslaufende Preisgarantie, Bonus-Wegfall, Vertragsende/Kuendigungsfrist,
  unplausible Werte, fehlende Angaben.

# Extrahierter Inhalt

Vollstaendiger validierter Text aus der .content.md.
```

## Regeln

- Betraege in der DB als Zahlen (Punkt als Dezimaltrenner), brutto; Daten als `YYYY-MM-DD`.
- Nicht sicher erkennbare Werte weglassen (NULL), nicht raten; in `notizen` bzw.
  `# Auffaelligkeiten` dokumentieren, was fehlt.
- Ein Dokument mit mehreren Sparten (Strom+Gas auf einer Rechnung): ein Datensatz je
  Sparte, `quelle_datei` mit Suffix `#strom` / `#gas` eindeutig machen.
- Keine parallelen OCR-Laeufe; das Lock des Helper-Skripts nicht mit `--no-lock` umgehen.
- `.DS_Store` und Systemdateien ueberspringen.
