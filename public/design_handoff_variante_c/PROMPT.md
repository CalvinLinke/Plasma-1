# Prompt für Claude Code

Kopiere den folgenden Text als Anweisung in Claude Code (der Ordner `design_handoff_variante_c/`
muss im Projekt liegen):

---

Baue die Landingpage **„Variante C" (Plasma Energie × tonyM)** in dieses Projekt ein.

**Vorlage:** Die exakte Optik, das Layout und alle Inhalte liegen in
`design_handoff_variante_c/reference/variante-c.html` (eigenständige HTML-Referenz mit
Inline-Styles und minimalem JavaScript). Die vollständige Spezifikation — Farben, Typografie,
Abstände, Texte, Verhalten — steht in `design_handoff_variante_c/README.md`. Lies beide Dateien
zuerst vollständig.

**Aufgabe:**
1. Setze die Seite **1:1** und **pixelgenau** um — gleiche Hex-Farben, Schriftgrößen, Radien,
   Abstände, Verläufe, Schatten und exakt dieselben Texte (inkl. „Was **TonyM** Kunden
   bekommen" — Marke zusammengeschrieben, ohne Bindestriche — und dem Tony-Zitat
   „Strom- und Gasvergleich: kurz und knackig, ohne Geschwafel. …").
2. Verwende die **bestehende Technologie und die etablierten Muster dieses Projekts** (z. B.
   React/Vue/Next-Komponenten + das hier übliche Styling-System wie CSS-Module/Tailwind).
   Falls das Projekt noch leer ist, wähle das passendste Framework und begründe kurz.
   Übernimm die Inline-Styles der Referenz **nicht** wörtlich, sondern überführe sie ins
   Styling-System des Projekts — **ohne** visuelle Werte zu verändern.
3. Übernimm die Assets aus `design_handoff_variante_c/reference/assets/` in das Asset-Verzeichnis
   des Projekts und passe die Bildpfade an. (`tony-headshot.jpg` wird in Variante C nicht
   genutzt — nur bei Bedarf.)
4. Binde **Inter** (Google Fonts, Gewichte 400/500/600/700/800) wie im Projekt üblich ein.
5. Implementiere die Formular-Interaktion:
   - Datei-Upload zeigt den Dateinamen an,
   - Absenden blendet das Formular aus und zeigt den „Vielen Dank!"-Erfolgszustand,
   - „Weitere Anfrage" setzt zurück.
   Ergänze sinnvolle Pflichtfeld-Validierung. Das Absenden ist im Prototyp ohne Backend —
   binde es an die im Projekt vorhandene Submit-/CRM-Logik an bzw. lege einen klaren TODO-Hook an.
6. Mach die Seite **responsive**: ≥1024px das 3-spaltige Bento-Grid (max. 1080px, zentriert),
   darunter auf 1–2 Spalten und schließlich einspaltig reduzieren (Details siehe README,
   Abschnitt „Responsive"). Der Prototyp zeigt nur die Desktop-Breite.

**Wichtig:**
- Keine Inhalte erfinden oder weglassen; nur das umsetzen, was in Referenz und README steht.
- Bestehende Projekt-Konventionen (Ordnerstruktur, Komponenten-Namensgebung, Lint-Regeln)
  respektieren.
- Am Ende kurz auflisten, welche Dateien du angelegt/geändert hast und wie man die Seite
  lokal aufruft.
