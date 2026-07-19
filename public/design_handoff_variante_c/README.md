# Handoff: Plasma Energie × tonyM — Landingpage „Variante C"

## Überblick
Co-Branding-Landingpage, über die der Versicherungsmakler **Tony Meuer (tonyM)** seinen
Kunden einen exklusiven Zugang zum Strom-/Gastarif-Vergleich von **Plasma Energie**
vermittelt. Der Nutzer lädt seine Stromrechnung hoch, gibt ein paar Kontaktdaten ein und
erhält innerhalb von 48 Stunden ein persönliches Angebot. Plasma übernimmt Vergleich,
Kündigung und Wechsel komplett.

„Variante C" ist das **Bento-Grid-Layout** (Kachel-Hero). Genau dieses Layout, diese Optik
und diese Inhalte sind 1:1 umzusetzen.

## Über die Design-Dateien
Die Datei in `reference/variante-c.html` ist eine **Design-Referenz in reinem HTML/CSS/JS** —
ein Prototyp, der Aussehen und Verhalten exakt zeigt, **kein** produktiver Code zum direkten
Übernehmen. Aufgabe ist, dieses Design **in der bestehenden Umgebung des Zielprojekts**
(React, Vue, Next.js, plain HTML o.ä.) mit dessen etablierten Mustern nachzubauen. Falls noch
keine Umgebung existiert, das passendste Framework wählen und das Design dort umsetzen.

Die Referenz nutzt **Inline-Styles** (so wie der Prototyp entstanden ist). Im Zielprojekt
sollten diese in das dort übliche Styling-System überführt werden (CSS-Module, Tailwind,
styled-components o.ä.) — **ohne die visuellen Werte zu verändern**.

## Fidelity
**High-Fidelity (hifi).** Pixelgenaue Vorlage mit finalen Farben, Typografie, Abständen und
Interaktionen. Bitte 1:1 nachbauen — exakte Hex-Werte, Schriftgrößen, Radien und Abstände
übernehmen.

## Canvas / Seitenbreite
- Design-Breite des weißen Karten-Containers: **1080 px**, zentriert.
- Höhe fließt mit dem Inhalt (im Print-Original ca. 1917 px).
- Auf echten Seiten responsive umsetzen: ab < 1080 px sollte das Bento-Grid auf eine Spalte
  zusammenfallen (siehe „Responsive" unten). Im Prototyp ist nur die Desktop-Breite gebaut.

## Abschnitte (von oben nach unten)

### 1. Co-Brand-Leiste
- Layout: `display:flex; align-items:center; justify-content:space-between; padding:18px 40px;`
  untere Trennlinie `1px solid #f1f1f5`.
- Links: **Plasma-Logo** (`assets/plasma-logo.png`), Höhe 34 px.
- Rechts: Label `EXKLUSIVER ZUGANG VON` (Inter 500, 12 px, `#9ca3af`, letter-spacing .04em)
  + **tonyM-Logo** (`assets/tonyM-logo.png`), Höhe 42 px. Abstand 14 px.

### 2. Bento-Hero
- Container: `padding:40px; background:#F8FAFC;`
- Grid: `grid-template-columns:1.15fr 1.15fr 1fr; gap:16px;`
- **Kachel A — Headline** (`grid-column:1 / 3`):
  - Hintergrund `linear-gradient(150deg,#ede9ff,#fff 70%)`, Rand `1px solid #efeafd`,
    `border-radius:22px; padding:34px;` dekorativer radialer Kreis oben rechts.
  - Pill-Badge: weiß, Rand `#e7e3ff`, Schloss-Icon + Text `EXKLUSIVE KONDITIONEN · NUR ÜBER
    DIESEN LINK` (Inter 600, 11 px, `#4B0082`).
  - H1: Inter 800, 38px/1.08, `#1A1B4B`, letter-spacing -0.03em. Text:
    „Bessere Konditionen —" + Zeilenumbruch + „über Ihren Makler." (zweite Zeile mit
    Verlaufstext, siehe `.gradtext-dark`).
  - Absatz: Inter 400, 15.5px/1.55, `#4b5563`, max-width 420px. Text:
    „Tony Meuer hat Ihnen Plasma empfohlen. Rechnung hoch, zwei Angaben — wir holen das Beste
    aus Ihrem Stromtarif heraus und wickeln den Wechsel komplett ab."
  - CTA-Button (Anker auf `#formC`): `#7B61FF`, weiß, Inter 600 15px, radius 12px, Pfeil-Icon,
    Schatten `0 8px 20px rgba(123,97,255,.3)`. Text „Rechnung hochladen".
- **Kachel B — Tony (hoch)** (`grid-column:3; grid-row:1 / 3`):
  - Hintergrund `#104070`, `border-radius:22px; padding:26px;`
    `display:flex; flex-direction:column; justify-content:space-between;` dekorativer Kreis.
  - tonyM-Logo (weiß invertiert via `filter:brightness(0) invert(1)`, Höhe 26 px, opacity .92).
  - Portrait `assets/tony-portrait.jpg`: `width:100%; height:240px; object-fit:cover;
    object-position:center 18%; border-radius:16px;`.
  - Zitat (eigener Flex-Block, kein margin — durch `space-between` mittig zwischen Bild und
    Namenszeile): Inter 500, 14.5px/1.5, weiß. **Exakter Text:**
    „Strom- und Gasvergleich: kurz und knackig, ohne Geschwafel. Die Abwicklung ist schnell,
    einfach und ohne Aufwand. So mag ich das – und so empfehle ich es auch gern weiter!"
    (deutsche Anführungszeichen „ … ", Gedankenstrich – als en-dash).
  - Namensblock (eigener Flex-Block, bleibt unten): „Tony Meuer" (Inter 700, 13.5px, weiß) +
    „Versicherungsmakler · Dresden" (Inter 400, 11.5px, `rgba(255,255,255,.6)`).
- **Kachel C — Beispiel-Ersparnis** (`grid-column:1`):
  - Weiß, Rand `1px solid #eef`, radius 22px, padding 24px.
  - Label `BEISPIEL-ANALYSE · STROMTARIF`. Zwei Balken: „Aktueller Vertrag 1.580 €"
    (roter Balken `#fecaca`, 100%) und „Plasma-Tarif 1.518 €" (Verlauf `#4B0082→#7B61FF`, 96%).
  - Ersparnis-Box (grün getönt `rgba(22,163,74,.07)`): „Ihre Ersparnis · Ø 62 € / Jahr"
    (`#16a34a`).
- **Kachel D — Was TonyM Kunden bekommen** (`grid-column:2`):
  - Weiß, Rand `1px solid #eef`, radius 22px, padding 24px.
  - Titel: „Was TonyM Kunden bekommen" (Inter 700, 15px, `#1A1B4B`).
    ⚠ Schreibweise exakt **„TonyM"** (Marke, zusammen, ohne Bindestriche), gefolgt von
    „Kunden" als separates Wort.
  - Drei Punkte mit lila Icon-Badge (`rgba(123,97,255,.1)`, 30×30, radius 9px):
    1. **Bevorzugte Bearbeitung** — „Ihre Anfrage wird vorgezogen behandelt." (Blitz-Icon)
    2. **Exklusive Anbieter** — „Tarife, die nicht auf Vergleichsportalen stehen." (Schild-Icon)
    3. **Direkter Draht** — „Ein fester Ansprechpartner über Ihren Makler." (Sprechblasen-Icon)

### 3. Vergleichs-Streifen
- `padding:50px 40px; background:#fff;` zentrierte Überschrift:
  Eyebrow `AUFWAND IM VERGLEICH` (`#7B61FF`), H2 „Selbst kümmern — oder uns machen lassen."
  (Inter 800, 30px, `#1A1B4B`).
- Zwei Spalten (`1fr 1fr`, gap 20px):
  - **Selbst** (grau `#fafafa`, Rand `#eee`): drei ✕-Punkte (`#cbd5e1`):
    „Tarife recherchieren & vergleichen", „Fristen und Kündigung selbst managen",
    „Nur öffentlich gelistete Tarife".
  - **Plasma übernimmt** (Verlauf `#faf9ff→#fff`, Rand `#e7e3ff`, lila Schatten): Plasma-Logo
    + „übernimmt", vier ✓-Punkte (lila Häkchen-Badge): „Eine Datei hochladen — fertig",
    „Kündigung & Wechsel komplett durch uns", „Exklusive Anbieter abseits der Portale",
    „Jährlicher Tarif-Check — wir behalten Ihre Daten im Blick und erneuern bei Bedarf".

### 4. Formular (`#formC`)
- `padding:50px 40px; background:#F8FAFC;` innen max-width 560px, zentriert.
- Kopf: H2 „Jetzt Ihre Konditionen sichern" (Inter 800, 28px) + Subline
  „Kostenlos & unverbindlich · Angebot in 48 Stunden".
- Karte (weiß, radius 24px, padding 26px, Schatten `0 10px 30px rgba(0,0,0,.04)`):
  - **Upload-Dropzone**: `2px dashed #d9d4f5`, radius 16px, padding 24px, Hintergrund `#faf9ff`,
    Upload-Icon. Default-Text „Energierechnung ablegen oder **auswählen**" + „PDF oder Foto ·
    max. 10 MB". Nach Dateiwahl: Dateiname in `#4B0082` anzeigen.
  - **Felder** (Grid 2 Spalten): Vorname, Nachname, E-Mail, Telefon, „PLZ / Wohnort"
    (volle Breite). Border `#e5e7eb`, radius 11px.
  - **Submit-Button**: `#7B61FF`, weiß, Inter 600 16px, „Kostenlos Angebot anfordern".
  - Hinweis: „Keine Weitergabe an Dritte · Vermittelt durch tonyM Versicherungsmakler".
  - **Erfolgs-Zustand** (nach Absenden): grüner Häkchen-Kreis (Verlauf `#4B0082→#7B61FF`),
    „Vielen Dank!", Text „Wir prüfen Ihre Rechnung und melden uns innerhalb von 48 Stunden mit
    Ihrem persönlichen Angebot." + Button „Weitere Anfrage" (setzt das Formular zurück).

### 5. Footer
- `padding:30px 40px; background:#0A0B1E;` flex, space-between.
- Links: Plasma-Logo (weiß invertiert, 26px) · Trenner · „Zugang vermittelt durch tonyM
  Versicherungsmakler". Rechts: „Impressum · Datenschutz · AGB".

## Interaktionen & Verhalten
- **Datei-Upload**: bei `change` Dateinamen anzeigen, Default-Prompt ausblenden.
- **Absenden**: Formularinhalt durch Erfolgs-Zustand ersetzen (kein echter Submit im Prototyp —
  im Zielprojekt an Backend/CRM anbinden; Validierung der Pflichtfelder ergänzen).
- **„Weitere Anfrage"**: zurück zum leeren Formular, Datei-Auswahl zurücksetzen.
- Header-CTA „Rechnung hochladen" scrollt per Anker zu `#formC`.
- Keine sonstigen Animationen; Hover-States nach Maßgabe des Zielsystems ergänzen (Buttons
  dürfen leicht abdunkeln).

## State Management
Minimaler lokaler State (pro Formular):
- `fileName: string | null` — Name der hochgeladenen Datei.
- `sent: boolean` — ob das Formular abgeschickt wurde (steuert Formular- vs. Erfolgs-Ansicht).
- Plus die Eingabefelder (Vorname, Nachname, E-Mail, Telefon, PLZ/Ort) als kontrollierte Werte.

## Design Tokens
**Farben**
- Primär-Lila: `#7B61FF`
- Tief-Violett (Verlauf/Akzent): `#4B0082`
- Marineblau (Tony-Kachel, Header-Karte): `#104070`
- Dunkles Marine (Footer): `#0A0B1E`
- Headline-Navy: `#1A1B4B`
- Fließtext: `#4b5563` / `#374151` / `#6b7280`
- Sekundärtext / Labels: `#9ca3af`
- Heller Section-BG: `#F8FAFC`
- Card-BG hell-lila: `#faf9ff`, `#ede9ff`
- Rahmen: `#eef`, `#eee`, `#e5e7eb`, `#e7e3ff`, `#efeafd`, `#f1f1f5`
- Erfolg/Grün: `#16a34a` (BG `rgba(22,163,74,.07)`)
- Warnung/Rot-Balken: `#fecaca`
- Akzent-Verläufe: `linear-gradient(135deg,#4B0082,#7B61FF)`, `linear-gradient(150deg,#ede9ff,#fff 70%)`

**Typografie** — Schrift: **Inter** (Google Fonts, Gewichte 400/500/600/700/800).
- H1 38px/1.08 · 800 · ls -0.03em
- H2 28–30px · 800 · ls -0.02em
- Kachel-Titel 15px · 700
- Body 14–15.5px · 400 · lh 1.4–1.55
- Labels/Eyebrows 11–12px · 600 · ls .04–.08em (uppercase)

**Radien**: Kacheln/Buttons-Karten 22px · große Cards 24px · Buttons/Inputs 11–12px ·
Bild 16px · Icon-Badges 6–9px · Pills 999px.

**Schatten**: Card `0 4px 24px rgba(0,0,0,.08)` · CTA `0 8px 20px rgba(123,97,255,.3)` ·
Vergleichskarte `0 12px 30px rgba(123,97,255,.10)` · Formularkarte `0 10px 30px rgba(0,0,0,.04)`.

**Abstände**: Section-Padding 40–50px · Grid-Gap 16–20px · Card-Padding 24–34px.

## Responsive (für echte Umsetzung)
- ≥ 1024px: Bento-Grid wie beschrieben (3 Spalten), 1080px max-width zentriert.
- 640–1024px: Grid auf 1–2 Spalten reduzieren, Tony-Kachel über volle Breite, Vergleich
  bleibt 2-spaltig oder stapelt.
- < 640px: alles einspaltig, Padding auf ~20–24px reduzieren, H1 ~28px.
(Der Prototyp zeigt nur die Desktop-Breite; Breakpoints sind im Zielsystem zu ergänzen.)

## Assets
Im Ordner `reference/assets/`:
- `plasma-logo.png` — Logo Plasma Energie (im Footer/Tony-Kachel weiß invertiert per CSS-Filter).
- `tonyM-logo.png` — Logo tonyM Versicherungsmakler (in Tony-Kachel weiß invertiert).
- `tony-portrait.jpg` — Hochformat-Porträt Tony Meuer (Tony-Kachel).
- `tony-headshot.jpg` — rundes Porträt (in Variante C **nicht** verwendet, nur als Reserve/
  für andere Varianten beigelegt).
Diese Dateien ins Asset-Verzeichnis des Zielprojekts übernehmen und Pfade entsprechend anpassen.

## Dateien in diesem Paket
- `README.md` — diese Spezifikation.
- `PROMPT.md` — fertiger Prompt für Claude Code.
- `reference/variante-c.html` — eigenständige, lauffähige HTML-Referenz (Inline-Styles + minimal JS).
- `reference/assets/*` — alle Bild-Assets.
