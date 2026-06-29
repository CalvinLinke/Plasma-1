# Mailversand der Website — Microsoft Graph (App-only)

**Status:** Implementiert auf Branch `graph-mailversand`, lokal gegen die echte
Entra-App getestet (beide Routen liefern HTTP 200, Mails kommen in box@ an).
Vercel-Variablen sind gesetzt. Offen ist nur noch Merge → Deploy (siehe unten).

## Warum Graph statt SMTP
Ursprünglich war SMTP an `box@plasma-energie.de` geplant. Das scheidet aus:
`box@` ist ein **freigegebenes Postfach** (kein eigener Login, keine Lizenz) und
der Tenant erzwingt **MFA** — Basic-Auth-SMTP ist damit nicht möglich. Stattdessen
sendet eine **Entra-App** per Microsoft Graph im **Client-Credentials-Flow**
(App-only): kein Benutzer-Login → MFA irrelevant, keine Lizenz, sendet nativ als box@.

## Wie es funktioniert
- **Entra-App** „Plasma Website Mailer" (Single-Tenant) mit Application-Permission
  **`Mail.Send`** (Microsoft Graph) + erteilter Admin-Zustimmung.
- Helper [`lib/graph-mail.ts`](../lib/graph-mail.ts): holt ein Token via
  Client-Credentials und ruft `POST /users/{MS_SENDER_UPN}/sendMail` auf. Nutzt das
  eingebaute `fetch`, **keine zusätzliche Dependency**. (nodemailer wurde entfernt.)
- Genutzt von beiden Mail-Routen:
  - [`app/api/angebot/route.ts`](../app/api/angebot/route.ts) — Angebotsformular + Rechnung
  - [`app/api/kontakt/route.ts`](../app/api/kontakt/route.ts) — Kontaktformular

## Environment-Variablen (Vercel: Production + Preview)
| Variable | Wert |
|---|---|
| `MS_TENANT_ID` | Verzeichnis-(Mandanten-)ID der Entra-App |
| `MS_CLIENT_ID` | Anwendungs-(Client-)ID der Entra-App |
| `MS_CLIENT_SECRET` | Geheimer Clientschlüssel (**Sensitive**; nicht im Repo) |
| `MS_SENDER_UPN` | `box@plasma-energie.de` |

Die alten `SMTP_*`-Variablen werden nicht mehr gebraucht und können in Vercel weg.
Lokal: Werte in `.env.local` eintragen (siehe `.env.local.example`).

## Noch zu tun
1. **Merge → Deploy:** Branch `graph-mailversand` pushen, PR, mergen. Erst dann
   deployt Vercel den Graph-Code (bis dahin läuft live noch der alte SMTP-Code).
2. **Empfohlen — App auf box@ einschränken:** `Mail.Send` (Application) erlaubt der
   App sonst, als *jedes* Postfach im Tenant zu senden. Per Exchange Online PowerShell
   eingrenzen:
   ```powershell
   Connect-ExchangeOnline
   New-DistributionGroup -Name "GraphMailerScope" -Type Security -Members box@plasma-energie.de
   New-ApplicationAccessPolicy -AppId <MS_CLIENT_ID> `
     -PolicyScopeGroupId GraphMailerScope@plasma-energie.de -AccessRight RestrictAccess `
     -Description "Plasma Website Mailer darf nur box@"
   Test-ApplicationAccessPolicy -Identity box@plasma-energie.de -AppId <MS_CLIENT_ID>
   ```
3. **Live-Test nach Deploy:** Formular auf https://www.plasma-energie.de/tonym
   absenden → Mail muss in box@ ankommen. Bei Fehler: Vercel → Deployment → Functions
   → `/api/angebot` bzw. `/api/kontakt`.
4. **Secret rotieren**, sobald alles steht (Secret ging durch mehrere Hände): in
   Entra → Zertifikate & Geheimnisse neu erzeugen, altes löschen, Vercel aktualisieren.

## Diagnose, falls keine Mail ankommt
Fast immer eine dieser drei Ursachen:
1. Admin-Zustimmung für `Mail.Send` fehlt (hier erledigt).
2. Falscher Env-Wert (Tenant-/Client-ID oder Secret).
3. Eine Application Access Policy schließt box@ aus.
Graph braucht **kein** MFA, **kein** Passwort, **kein** SMTP.
