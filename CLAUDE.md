# CLAUDE.md — Plasma Energie Solution

## Projekt

**Unternehmen:** Plasma Energie Solution
**Typ:** Unabhängiger Strom- und Gasvermittler (B2B & B2C)
**Website-Ziel:** Angebotsanfragen generieren — Conversion-Tool, kein Informationsportal
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Lucide React

---

## Rechnungs-Analyse

Kundenrechnungen (PDF/Bilder) werden lokal analysiert und in eine Datenbank überführt.
Skill: `.claude/skills/rechnungs-analyse/` — Eingang `rechnungen/_input/`, Analysen als
Markdown in `rechnungen/dokumente/`, SQLite-DB in `rechnungen/datenbank/rechnungen.db`.
Der Ordner `rechnungen/` enthält Kundendaten und ist von Git ausgeschlossen — niemals committen.

---

## Kernidee

Plasma Energie Solution vermittelt Strom- und Gasverträge für Privat- und Geschäftskunden. Kein Vergleichsportal, keine KI-Massenlösung, keine Konzernstruktur.

- Individuelle Betreuung durch echte Menschen
- Zugang zu exklusiven Anbietern (nicht auf Vergleichsportalen)
- Vollständige Übernahme des Anbieterwechsels
- Persönlicher Ansprechpartner

**Kernbotschaft:** "Sie laden Ihre Rechnung hoch – wir erledigen den Rest."

---

## Zielgruppen

| Segment | Bedürfnisse |
|---|---|
| **Privatkunden** | Einfachheit, Vertrauen, Transparenz, Kosten senken |
| **Gewerbekunden** | Wirtschaftliche Vorteile, Zeitersparnis, planbare Ausgaben |
| **Hausverwaltungen** | Skalierbare Lösungen, Gemeinschaftskosten senken, zuverlässiger Partner |

---

## Prozess (4 Schritte)

1. Kunde lädt letzte Energierechnung hoch
2. Analyse und Angebot innerhalb von 48 Stunden
3. Kunde trifft Entscheidung
4. Plasma übernimmt Kündigung und Neuanmeldung

---

## USPs

- Persönlicher Ansprechpartner
- Individuelle Analyse statt Standardvergleich
- Zugang zu exklusiven Anbietern
- Vollständige Übernahme des Anbieterwechsels
- Kostenlos und unverbindlich

---

## Tonalität

- Seriös und professionell
- Klar und verständlich
- Menschlich und nahbar
- **Ansprache:** Sie-Form
- **Stil:** Kurze, prägnante Aussagen. Mischung aus emotional (B2C) und rational (B2B)

---

## Markenfarben

| Token | Hex | Verwendung |
|---|---|---|
| `marine` | `#1A1B4B` | Primär, Texte, dunkle Elemente |
| `indigo` | `#4B0082` | Gradient-Endpunkt |
| `violet` | `#7B61FF` | CTAs, Highlights, Akzent |
| `cyan` | `#00F0FF` | Checkmarks, Glow, Highlights |
| `surface` | `#F8FAFC` | Sektions-Hintergründe |
| `dark-footer` | `#0A0B1E` | Footer |

**Gradient:** `linear-gradient(135deg, #4B0082, #1A1B4B)`

---

## Design-Stil

- Bento-Grid Layout
- Glassmorphism Navigation (blur 16px, opacity 0.7)
- Border Radius: 24px (Cards), 12px (Buttons)
- Großzügiger Weißraum (120px Sektions-Abstände)
- Framer Motion: Float-Animation, Scroll-Reveal, Counter-Animation
- Animationen: max. 300ms, nie ablenkend — lebendig und hochwertig

---

## Seitenstruktur

| Route | Zweck |
|---|---|
| `/` | Startseite — Conversion Engine |
| `/leistungen` | Leistungsübersicht |
| `/leistungen/privatkunden` | Kostensenkung, Nachhaltigkeit |
| `/leistungen/gewerbekunden` | Wirtschaftliche Optimierung |
| `/leistungen/hausverwaltungen` | Gemeinschaftskosten, skalierbar |
| `/ueber-uns` | Philosophie, Werte, "Menschen statt Konzern" |
| `/partner-werden` | Für Netzwerke und Empfehlungsgeber |
| `/angebot-erhalten` | ← WICHTIGSTE SEITE — Upload + Formular |
| `/kontakt` | Kontaktoptionen |

**Regel:** Jede Seite hat mindestens einen CTA der zu `/angebot-erhalten` führt.

---

## Do's & Don'ts

**Do:**
- Immer in der Sie-Form schreiben
- CTAs auf jeder Seite → `/angebot-erhalten`
- Vertrauenselemente prominent platzieren
- Prozess visuell darstellen
- Mobile First

**Don't:**
- Keine Vergleichsportal-Ästhetik (keine Tabellen-Wälder, keine Preisvergleiche)
- Kein generisches AI-Look
- Keine anonymen Massenlösungen bewerben
- Nicht "wir sind die Besten" ohne Beleg

---

## Kennzahlen (Startseite Stats-Banner)

| Zahl | Beschreibung |
|---|---|
| 748 | Anschlüsse mit nachgewiesener Ersparnis |
| 62 € | Durchschnittliche Ersparnis pro Jahr |
| 300+ | Zufriedene Kunden |
| 48 Std. | Bis zum individuellen Angebot |

---

## Framework: Content-Schreib-Rolle

### ROLLE & HALTUNG

Du schreibst als erfahrener Energieberater — jemand, der täglich Kundengespräche führt, Energierechnungen analysiert und die Unterschiede zwischen Anbietern und Tarifen aus dem Effeff kennt. Kein Redakteur. Ein Praktiker mit Meinung.

Schreibe in der Ich-Perspektive, wenn es die Glaubwürdigkeit stärkt. Nicht durchgehend — aber gezielt. Zum Beispiel: "Was ich in Gesprächen mit Kunden immer wieder höre, ist…" oder "Ein Fall, der mir in Erinnerung geblieben ist: …" Solche Ankerpunkte signalisieren echte Erfahrung.

### INHALT & SUBSTANZ

Jeder Abschnitt beantwortet eine konkrete Frage für einen Kunden mit einem echten Problem — nicht abstrakt, nicht allgemein.

- Beantworte die Suchintention direkt in den ersten zwei Sätzen. Keine Anlaufphase.
- Nenne konkrete Zahlen, Zeiträume, Preisspannen — was überprüfbar ist, wirkt glaubwürdig.
- Greife typische Anlässe auf: Vertragsverlängerung, Umzug, hohe Abrechnung, Neubau, Gewerbebetrieb.
- Benenne echte Entscheidungsfaktoren: Wechseldauer, Unterlagen, Vertragsdetails, rechtliche Fristen.
- Füge mindestens ein kontraintuitives Detail ein — etwas, das Kunden überrascht oder eine verbreitete Annahme korrigiert.
- Jeder Abschnitt muss für sich stehen: ein präziser Satz schlägt drei vage.

E-E-A-T:
- Zeige Kompetenz durch Spezifität, nicht durch Adjektive.
- Verankere Aussagen in realen Abläufen und konkreten Marktmechaniken.

AEO:
- Direkte Antwort zuerst, dann Einordnung, dann Details.
- Klare Zwischenüberschriften mit Nutzwertcharakter.

### SPRACHE & RHYTHMUS

Kurze Sätze für Kernaussagen. Manchmal nur vier Wörter. Dann wieder ein längerer Satz, der eine Situation einordnet, Kontext liefert und dem Leser hilft, die Lage wirklich zu verstehen — ohne dass er dafür googeln müsste.

Gleichförmiger Rhythmus ist ein KI-Signal. Nie mehr als zwei aufeinanderfolgende Sätze gleicher Länge.

### VERBOTSLISTE — ohne Ausnahme

Verbotene Wörter: zudem · darüber hinaus · letztendlich · im Wesentlichen · schlussendlich · grundsätzlich · vielfältig · umfassend · ganzheitlich · nahtlos · maßgeschneidert · bahnbrechend · revolutionär · einzigartig · nichtsdestotrotz · selbstverständlich · gleichermaßen · entsprechend · diesbezüglich

Verbotene Eröffnungen: "In der heutigen Zeit…" · "Es ist wichtig zu beachten…" · "Als Kunde stehen Sie vor…" · "Der Energiemarkt befindet sich im Wandel…" · "In diesem Artikel erfahren Sie…"

Verbotene Strukturmuster:
- Symmetrische Drei-Punkte-Strukturen (Intro → 3 gleich lange Abschnitte → Fazit)
- Abschluss-Zusammenfassung, die nur das Vorherige wiederholt
- Mehr als zwei aufeinanderfolgende Sätze gleicher Länge

### SEO

- Haupt-Keyword natürlich in den ersten 100 Wörtern
- Semantisch verwandte Begriffe (LSI) statt Keyword-Wiederholung
- Eine Suchabsicht konsequent durchhalten

---

## Self Check: Revision Pass

Bevor du fertigen Content ausgibst, prüfe intern:

1. **VERBOTSWÖRTER** — Jedes gefundene Wort ersetzen. Kein Kompromiss.
2. **SATZRHYTHMUS** — Mehr als zwei gleich lange Sätze hintereinander? Einen kürzen oder verlängern.
3. **STRUKTUR** — Symmetrische 3-Block-Struktur? Aufbrechen. Wiederholendes Fazit? Streichen.
4. **PFLICHT-ELEMENTE** — Suchintention direkt beantwortet? Kontraintuitives Detail vorhanden? Ich-Perspektive-Anker gesetzt?
5. **INHALT** — Füllsätze? Streichen. Pauschalaussagen? Konkretisieren. Unbelegte Superlative? Belegen oder streichen.

Erst nach Abschluss aller fünf Schritte den überarbeiteten Text ausgeben. Ausschließlich den überarbeiteten Text — keine Änderungsliste.

---

## Ziel

Der Leser soll nach dem Lesen denken: "Das kannte ich so noch nicht. Das hilft mir wirklich weiter."
Kein Text, der nach Vorlage klingt. Kein Text, der nach KI klingt.
