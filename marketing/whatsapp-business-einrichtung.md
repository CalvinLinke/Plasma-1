# WhatsApp Business einrichten — Schritt-für-Schritt-Plan

Ziel: Eigene Firmen-WhatsApp-Nummer für Plasma Energie Solution (Flyer, `/cashback`, Lead-Magnets), **strikt getrennt** vom privaten WhatsApp. Kostenlos, ohne zweite SIM, ohne Zweithandy.

**Stand:** Juli 2026 · Aufwand: ca. 30–45 Minuten

---

## Überblick

| Baustein | Lösung | Kosten |
|---|---|---|
| Firmen-Nummer | Satellite-App (deutsche Mobilnummer, rein virtuell, keine SIM) | 0 € |
| WhatsApp Firma | WhatsApp Business App auf dem iPhone (grünes Icon, eigene App) | 0 € |
| WhatsApp privat | Bleibt unverändert in der normalen WhatsApp-App | — |
| Mac: Firma | `web.whatsapp.com` als Safari-Dock-App, verknüpft mit dem Business-Konto | 0 € |
| Mac: privat | Bleibt in der WhatsApp-Mac-App | — |

Trennung ist vollständig: zwei Konten, zwei Nummern, keine gemeinsamen Chats/Kontakte/Backups.

---

## Schritt 1: Firmen-Nummer per Satellite besorgen (ohne SIM)

1. **Satellite-App** aus dem App Store laden (Anbieter: sipgate).
2. Kostenlos registrieren → du erhältst eine **echte deutsche Mobilnummer**, die nur als App läuft (VoIP). Kein SIM-Tausch, kein Zweitgerät.
3. Nummer notieren — das wird die offizielle Firmen-WhatsApp-Nummer.

> **Wichtig:** Satellite empfängt **keine SMS**. Die WhatsApp-Verifizierung in Schritt 2 deshalb zwingend per **Anruf** machen.

## Schritt 2: WhatsApp Business App einrichten (iPhone)

1. **WhatsApp Business** (grünes Icon mit „B") aus dem App Store laden — läuft parallel zur privaten WhatsApp-App.
2. Beim Start die **Satellite-Nummer** eintragen.
3. Bei der Verifizierung nicht auf die SMS warten, sondern **„Anruf statt SMS"** wählen → der Anruf kommt in der Satellite-App an, angesagten Code in WhatsApp Business eintippen.
4. **Kein** Backup/Chat-Import vom privaten Konto übernehmen (Trennung!). Frisch starten.

## Schritt 3: Firmenprofil ausfüllen

In WhatsApp Business: Einstellungen → Unternehmenstools → Unternehmensprofil:

- **Name:** Plasma Energie Solution (kann später nicht beliebig oft geändert werden — korrekt eintragen)
- **Logo** als Profilbild (violett-cyan „P")
- **Adresse:** Grüne Straße 13b, 01067 Dresden
- **Kategorie:** Energieversorgung / Dienstleistung
- **Website:** plasma-energie.de
- **E-Mail:** box@plasma-energie.de
- **Beschreibung:** kurz, Sie-Form, z. B. „Wir finden Ihren günstigeren Strom- und Gastarif und übernehmen den kompletten Wechsel. Kostenlos und unverbindlich."

## Schritt 4: Automatisierungen einrichten (alle kostenlos)

Einstellungen → Unternehmenstools:

1. **Begrüßungsnachricht** (geht automatisch an jeden neuen Chat):
   > „Willkommen bei Plasma Energie Solution! Schicken Sie uns einfach ein Foto Ihrer letzten Stromrechnung. Wir prüfen Ihr Sparpotenzial und melden uns innerhalb von 48 Stunden mit einem Angebot. Kostenlos und unverbindlich."
2. **Abwesenheitsnachricht** (außerhalb der Geschäftszeiten):
   > „Danke für Ihre Nachricht! Wir sind gerade nicht erreichbar und melden uns am nächsten Werktag bei Ihnen."
3. **Schnellantworten** anlegen (per `/` im Chat abrufbar), z. B.:
   - `/rechnung` → Bitte um Foto der letzten Jahresabrechnung
   - `/cashback` → Erklärung der 50-€-Cashback-Bedingungen + Link plasma-energie.de/cashback
   - `/unterlagen` → Liste der benötigten Angaben (Zählernummer, Jahresverbrauch, aktueller Anbieter)

## Schritt 5: Mac einrichten (strikt getrennt)

**Privat** bleibt in der WhatsApp-Mac-App — nichts ändern.

**Firma** als eigene Dock-App:

1. In **Safari** `web.whatsapp.com` öffnen.
2. Teilen-Symbol → **„Zum Dock hinzufügen"** → als „WhatsApp Business" benennen.
3. Die Dock-App öffnen, QR-Code anzeigen lassen.
4. Auf dem iPhone in **WhatsApp Business**: Einstellungen → Verknüpfte Geräte → Gerät hinzufügen → QR-Code scannen.

Ergebnis: zwei getrennte Fenster/Icons im Dock, keine Vermischung. (Alternative statt Safari: eigenes Chrome-Profil nur für die Firma.)

## Schritt 6: Nummer überall eintragen

Sobald die Nummer live ist:

- [ ] Flyer-Prompt aktualisieren: `marketing/flyer-cashback-konzept-und-prompt.md` (WhatsApp-Nummer in Schritt 2 der Rückseite + Kontaktwege)
- [ ] Lead-Magnet-CI aktualisieren: NAP-Zeile in `marketing/leadmagnet-prompts.md` (ersetzt +49 172 8182583 als Kontakt, falls gewünscht)
- [ ] Website: Kontaktseite, WhatsApp-Buttons, künftige `/cashback`-Landingpage
- [ ] `wa.me`-Link erzeugen: `https://wa.me/49XXXXXXXXXXX` (Nummer ohne führende 0, mit 49) — dieser Link gehört hinter alle WhatsApp-Buttons und in den Flyer-QR-Alternativweg

## Hinweise & Grenzen

- **Eine Nummer = ein WhatsApp-Konto.** Die Satellite-Nummer darf nirgendwo sonst für WhatsApp registriert werden.
- Satellite-Konto gelegentlich nutzen/App aktuell halten, damit die Nummer aktiv bleibt.
- Die Satellite-Nummer taugt gleichzeitig als **Telefon-Kontakt** („Lieber anrufen?") — Anrufe kommen in der Satellite-App an. Eine Nummer deckt damit beide Kontaktwege auf dem Flyer ab.
- Ein echter **Chatbot** (automatisierte Dialoge) bräuchte die WhatsApp Business Platform/API über Anbieter wie Twilio oder 360dialog — kostenpflichtig pro Nachricht. Erst prüfen, wenn das Nachrichtenvolumen die manuelle Beantwortung sprengt.
- Rechtlich: WhatsApp-Kontakt auf der Website in der Datenschutzerklärung erwähnen (Datenübermittlung an Meta).
