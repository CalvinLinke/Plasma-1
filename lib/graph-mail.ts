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

import { getMailboxUpn, graphFetch } from "@/lib/graph-auth";

export type GraphMail = {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
};

export async function sendMailViaGraph(mail: GraphMail): Promise<void> {
  const message: Record<string, unknown> = {
    subject: mail.subject,
    body: { contentType: "HTML", content: mail.html },
    toRecipients: [{ emailAddress: { address: mail.to } }],
  };
  if (mail.replyTo) {
    message.replyTo = [{ emailAddress: { address: mail.replyTo } }];
  }

  const res = await graphFetch(
    `/users/${encodeURIComponent(getMailboxUpn())}/sendMail`,
    {
      method: "POST",
      body: JSON.stringify({ message, saveToSentItems: false }),
    },
  );

  if (!res.ok) {
    throw new Error(`Graph-sendMail fehlgeschlagen (${res.status}): ${await res.text()}`);
  }
}
