// Versendet E-Mails über die Microsoft Graph API (Client-Credentials-Flow).
// Es meldet sich KEIN Benutzer an — die Entra-App authentifiziert sich mit
// einem Client-Secret. Dadurch ist MFA / Security Defaults irrelevant, es wird
// keine Lizenz benötigt, und die Mail geht nativ als MS_SENDER_UPN raus.
//
// Nötige Env-Variablen (in Vercel setzen):
//   MS_TENANT_ID      – Verzeichnis-(Mandanten-)ID der Entra-App
//   MS_CLIENT_ID      – Anwendungs-(Client-)ID der Entra-App
//   MS_CLIENT_SECRET  – Geheimer Clientschlüssel (als "Sensitive" markieren)
//   MS_SENDER_UPN     – Absender-Postfach (Default: box@plasma-energie.de).
//                       Die App braucht Mail.Send auf genau dieses Postfach
//                       (am besten per Application Access Policy eingegrenzt).

export type GraphMail = {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
};

const TENANT = () => process.env.MS_TENANT_ID || "";
const CLIENT_ID = () => process.env.MS_CLIENT_ID || "";
const CLIENT_SECRET = () => process.env.MS_CLIENT_SECRET || "";
const SENDER = () => process.env.MS_SENDER_UPN || "box@plasma-energie.de";

async function getAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID(),
    client_secret: CLIENT_SECRET(),
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT()}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  if (!res.ok) {
    throw new Error(`Graph-Token fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Graph-Token: kein access_token erhalten");
  return data.access_token;
}

export async function sendMailViaGraph(mail: GraphMail): Promise<void> {
  const token = await getAccessToken();

  const message: Record<string, unknown> = {
    subject: mail.subject,
    body: { contentType: "HTML", content: mail.html },
    toRecipients: [{ emailAddress: { address: mail.to } }],
  };
  if (mail.replyTo) {
    message.replyTo = [{ emailAddress: { address: mail.replyTo } }];
  }

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER())}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // saveToSentItems: false — Absender und Empfänger sind dasselbe Postfach,
      // die Mail liegt also ohnehin im Posteingang; kein doppelter Eintrag nötig.
      body: JSON.stringify({ message, saveToSentItems: false }),
    }
  );

  if (!res.ok) {
    throw new Error(`Graph-sendMail fehlgeschlagen (${res.status}): ${await res.text()}`);
  }
}
