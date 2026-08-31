// Gemeinsame Graph-Authentifizierung (Client-Credentials) für Mail-Versand
// und Postfach-Zugriff.

const TENANT = () => process.env.MS_TENANT_ID || "";
const CLIENT_ID = () => process.env.MS_CLIENT_ID || "";
const CLIENT_SECRET = () => process.env.MS_CLIENT_SECRET || "";

export function getMailboxUpn(): string {
  return process.env.MS_SENDER_UPN || "box@plasma-energie.de";
}

export async function getGraphAccessToken(): Promise<string> {
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
    },
  );

  if (!res.ok) {
    throw new Error(`Graph-Token fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Graph-Token: kein access_token erhalten");
  return data.access_token;
}

export async function graphFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getGraphAccessToken();
  const url = path.startsWith("https://")
    ? path
    : `https://graph.microsoft.com/v1.0${path}`;

  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}
