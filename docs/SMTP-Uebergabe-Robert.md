# Übergabe an Robert — SMTP/Mailversand für plasma-energie.de fertigstellen

**Ziel:** Damit Angebotsanfragen vom Website-Formular (inkl. hochgeladener Rechnung)
per E-Mail an **box@plasma-energie.de** zugestellt werden, fehlt nur noch die
SMTP-Konfiguration. Der Rest (Datei-Upload/Blob-Store, Download-Link, Auto-Löschung)
ist bereits eingerichtet und funktioniert.

**Warum du, Robert:** Das Postfach box@plasma-energie.de liegt auf **Microsoft 365**.
Der dortige Admin-Zugang liegt bei dir. Zwei Dinge sind nötig: (1) „Authentifiziertes
SMTP" für das Postfach freischalten, (2) das Passwort bereitstellen bzw. die
Variablen in Vercel setzen.

---

## Was bereits erledigt ist (kein Handlungsbedarf)
- ✅ Vercel-Projekt: `plasma-energie` (Live: www.plasma-energie.de)
- ✅ Blob-Store „Plasma-Rechnungen" verbunden → `BLOB_READ_WRITE_TOKEN` gesetzt
- ✅ `DOWNLOAD_SECRET`, `CRON_SECRET` in Vercel gesetzt
- ❌ **SMTP-Variablen fehlen** ← dein Teil

---

## Schritt 1 — „Authentifiziertes SMTP" in Microsoft 365 aktivieren

Microsoft 365 hat SMTP-AUTH bei neuen Tenants standardmäßig **deaktiviert**.
Ohne diese Freischaltung lehnt der Server den Login ab
(Fehler: „SmtpClientAuthentication is disabled for the Tenant/Mailbox").

**Variante A — über das Admin Center (einfach):**
1. https://admin.microsoft.com → **Benutzer → Aktive Benutzer**
2. `box@plasma-energie.de` öffnen → Tab **E-Mail**
3. **E-Mail-Apps verwalten** → Häkchen bei **„Authentifiziertes SMTP"** setzen → Speichern

**Variante B — per PowerShell (falls der Schalter fehlt / tenant-weit nötig):**
```powershell
# Pro Postfach:
Set-CASMailbox -Identity box@plasma-energie.de -SmtpClientAuthenticationDisabled $false

# Falls tenant-weit deaktiviert ist, zusätzlich:
Set-TransportConfig -SmtpClientAuthenticationDisabled $false
```

**Hinweis MFA:** Ist für das Postfach Multi-Faktor-Authentifizierung aktiv, funktioniert
das normale Passwort nicht für SMTP. Dann ein **App-Passwort** erstellen
(https://account.microsoft.com → Sicherheit → erweiterte Optionen → App-Passwörter)
und dieses statt des normalen Passworts verwenden.

---

## Schritt 2 — SMTP-Variablen in Vercel setzen

In Vercel → Projekt **plasma-energie** → **Settings → Environment Variables**.
Folgende fünf Variablen für **Production** *und* **Preview** anlegen:

| Name | Wert |
|---|---|
| `SMTP_HOST` | `smtp.office365.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `box@plasma-energie.de` |
| `SMTP_PASS` | *(Postfach- bzw. App-Passwort — als „Sensitive" markieren)* |

Danach **Redeploy** auslösen (Deployments → letztes Deployment → „Redeploy"), damit die
Variablen aktiv werden.

> Alternativ per CLI (falls du Vercel-CLI nutzt), Beispiel:
> ```bash
> printf "smtp.office365.com" | vercel env add SMTP_HOST production
> printf "587"                | vercel env add SMTP_PORT production
> printf "false"              | vercel env add SMTP_SECURE production
> printf "box@plasma-energie.de" | vercel env add SMTP_USER production
> printf "<PASSWORT>"         | vercel env add SMTP_PASS production
> # (gleiche 5 Befehle mit "preview" wiederholen) → danach: vercel --prod
> ```

---

## Schritt 3 — Test (Nachweis, dass es funktioniert)

1. https://www.plasma-energie.de/tonym öffnen (oder /angebot-erhalten)
2. Test-PDF hochladen, Formular ausfüllen, absenden
3. Prüfen: Kommt die Mail bei **box@plasma-energie.de** an?
   - Mit „Rechnung herunterladen"-Button = alles korrekt.
   - Falls der Button fehlt und nur ein Pfad-Hinweis erscheint → `DOWNLOAD_SECRET`
     fehlt/falsch (sollte aber gesetzt sein).
   - Falls **keine** Mail kommt → meist SMTP-AUTH (Schritt 1) noch nicht aktiv oder
     falsches Passwort. Logs unter Vercel → Deployment → Functions → `/api/angebot`.

---

## Technischer Hintergrund (für Rückfragen)
- Versand-Code: `app/api/angebot/route.ts` (nodemailer, liest `SMTP_*` aus den Env-Variablen).
- Datei-Upload läuft direkt vom Browser in den privaten Vercel-Blob-Store
  (`app/api/upload/route.ts`), Download via signiertem Link (`app/api/rechnung/route.ts`),
  Auto-Löschung nach 30 Tagen (`app/api/cleanup/route.ts`, täglicher Cron).
- Empfängeradresse ist im Code fest auf box@plasma-energie.de gesetzt.

---

## Prompt zum Weitermachen (für Calvin / Claude Code)
Sobald Robert SMTP-AUTH aktiviert und das Passwort bereitgestellt hat, in Claude Code:
**„Mailversandt Rechnung"** — dann werden die 5 SMTP-Variablen in Vercel gesetzt,
ein Redeploy ausgelöst und der Live-Test gemacht.
