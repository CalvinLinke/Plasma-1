import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const DEFAULT_BASE = "https://www.neue-energie.de";

export type PortalSession = {
  cookies: Record<string, string>;
  csrfToken?: string;
};

export type PortalConfig = {
  baseUri: string;
  username: string;
  password: string;
  sessionFile?: string;
};

export type PortalRequestResult = {
  url: string;
  status: number;
  contentType: string;
  body: unknown;
  raw: string;
};

export function loadPortalConfig(): PortalConfig | { error: string } {
  const username = process.env.NEUE_ENERGIE_PORTAL_USER?.trim();
  const password = process.env.NEUE_ENERGIE_PORTAL_PASSWORD;
  if (!username || !password) {
    return {
      error:
        "NEUE_ENERGIE_PORTAL_USER und NEUE_ENERGIE_PORTAL_PASSWORD fehlen in .env.local (Partner-Login, nicht der API-Key)",
    };
  }
  return {
    baseUri: (process.env.NEUE_ENERGIE_PORTAL_BASE_URI || DEFAULT_BASE).replace(/\/$/, ""),
    username,
    password,
    sessionFile: process.env.NEUE_ENERGIE_PORTAL_SESSION_FILE,
  };
}

function cookieHeader(session: PortalSession): string {
  return Object.entries(session.cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function storeCookies(session: PortalSession, headers: Headers): void {
  const raw = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];
  for (const line of raw) {
    const pair = line.split(";", 1)[0];
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (value === "" || /deleted/i.test(value)) {
      delete session.cookies[name];
    } else {
      session.cookies[name] = value;
    }
  }
}

function isLoggedIn(result: PortalRequestResult): boolean {
  if (result.url.includes("/partner-area/") || result.url.includes("/business-area/")) return true;
  if (result.raw.includes("/logout") || result.raw.includes(">Abmelden<")) return true;
  if (result.raw.includes("active-user-wrapper")) return true;
  return false;
}

function extractCsrf(html: string): string | undefined {
  const named = html.match(/name="_csrf_token"[^>]*value="([^"]+)"/i);
  if (named?.[1]) return named[1];
  const reversed = html.match(/value="([^"]+)"[^>]*name="_csrf_token"/i);
  if (reversed?.[1]) return reversed[1];
  const meta = html.match(/name="csrf-token"[^>]*content="([^"]+)"/i);
  return meta?.[1];
}

function parseBody(raw: string, contentType: string): unknown {
  if (contentType.includes("application/json") || raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

async function portalFetch(
  config: PortalConfig,
  session: PortalSession,
  path: string,
  init: RequestInit = {},
): Promise<PortalRequestResult> {
  const startUrl = path.startsWith("http") ? path : `${config.baseUri}${path}`;
  let url = startUrl;
  let method = (init.method || "GET").toUpperCase();
  let body = init.body;
  let headers: Record<string, string> = {
    accept: "text/html,application/json;q=0.9,*/*;q=0.8",
    "user-agent": "PlasmaEnergiePortalBot/0.1",
    ...(init.headers as Record<string, string> | undefined),
  };

  for (let hop = 0; hop < 8; hop += 1) {
    const response = await fetch(url, {
      method,
      body,
      headers: {
        ...headers,
        cookie: cookieHeader(session),
      },
      redirect: "manual",
    });
    storeCookies(session, response.headers);

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) break;
      url = new URL(location, url).toString();
      if (response.status === 303 || ((response.status === 301 || response.status === 302) && method === "POST")) {
        method = "GET";
        body = undefined;
        const nextHeaders = { ...headers };
        delete nextHeaders["content-type"];
        headers = nextHeaders;
      }
      continue;
    }

    const raw = await response.text();
    const contentType = response.headers.get("content-type") || "";
    const csrf = extractCsrf(raw);
    if (csrf) session.csrfToken = csrf;
    return {
      url: response.url || url,
      status: response.status,
      contentType,
      raw,
      body: parseBody(raw, contentType),
    };
  }

  throw new Error(`Zu viele Redirects bei ${startUrl}`);
}

export function savePortalSession(file: string, session: PortalSession): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(session, null, 2));
}

export function loadPortalSession(file: string): PortalSession | null {
  if (!existsSync(file)) return null;
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as PortalSession;
    if (!parsed?.cookies || typeof parsed.cookies !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function loginNeueEnergiePortal(
  config: PortalConfig,
): Promise<{ ok: true; session: PortalSession } | { ok: false; error: string; result?: PortalRequestResult }> {
  const session: PortalSession = { cookies: {} };
  const home = await portalFetch(config, session, "/");
  const csrf = session.csrfToken || extractCsrf(home.raw);
  if (!csrf) {
    return { ok: false, error: "Kein CSRF-Token auf der Startseite", result: home };
  }

  const body = new URLSearchParams({
    _csrf_token: csrf,
    _username: config.username,
    _password: config.password,
    _submit: "OK",
  });

  const result = await portalFetch(config, session, "/login_check", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      origin: config.baseUri,
      referer: `${config.baseUri}/`,
    },
    body,
  });

  if (!isLoggedIn(result) || result.status >= 400) {
    return {
      ok: false,
      error: `Login fehlgeschlagen (HTTP ${result.status}, URL ${result.url})`,
      result,
    };
  }

  if (config.sessionFile) savePortalSession(config.sessionFile, session);
  return { ok: true, session };
}

const ajaxHeaders = {
  accept: "application/json, text/javascript, */*; q=0.01",
  "x-requested-with": "XMLHttpRequest",
  referer: "",
};

export async function portalGet(
  config: PortalConfig,
  session: PortalSession,
  path: string,
  ajax = false,
): Promise<PortalRequestResult> {
  return portalFetch(config, session, path, {
    headers: ajax
      ? {
          ...ajaxHeaders,
          referer: `${config.baseUri}/partner-area/calculator/`,
        }
      : { referer: `${config.baseUri}/partner-area/calculator/` },
  });
}

export async function portalPost(
  config: PortalConfig,
  session: PortalSession,
  path: string,
  payload: URLSearchParams | Record<string, string>,
): Promise<PortalRequestResult> {
  const body = payload instanceof URLSearchParams ? payload : new URLSearchParams(payload);
  return portalFetch(config, session, path, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      origin: config.baseUri,
      referer: `${config.baseUri}/partner-area/calculator/`,
      "x-requested-with": "XMLHttpRequest",
      accept: "application/json, text/javascript, */*; q=0.01",
    },
    body,
  });
}

export type PortalCalculatorInput = {
  zip: string;
  city: string;
  street: string;
  houseNumber: string;
  consumptionKwh: number;
  energyType?: "electro" | "gas";
  customerType?: "client_type_private" | "client_type_commercial";
  contractType?: "type_changing_provider" | "type_move";
  currentProviderName?: string;
};

export type CalculatorSubmitData = {
  energyType: "electro" | "gas";
  clientType: "client_type_private" | "client_type_commercial";
  zip: string;
  city: string;
  street: string;
  houseNumber: string;
  consumption: number;
  consumptionNight: number | null;
  electroType: string | null;
  gasType: string | null;
  priceDate: string | null;
  additionalInfo: unknown;
  selfPay: boolean;
  providerName: string | null;
  providerCode: string | null;
  cityProviderName: string | null;
  cityProviderTariff: string | null;
  compareMonthPrice: number | null;
  compareWorkPrice: number | null;
  compareWorkPriceNight: number | null;
};

export function toJqueryForm(data: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  const add = (key: string, value: unknown): void => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => add(`${key}[${index}]`, item));
      return;
    }
    if (typeof value === "object") {
      for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
        add(key ? `${key}[${childKey}]` : childKey, childValue);
      }
      return;
    }
    if (typeof value === "boolean") {
      params.append(key, value ? "true" : "false");
      return;
    }
    params.append(key, String(value));
  };
  for (const [key, value] of Object.entries(data)) add(key, value);
  return params;
}

export function buildCalculatorSubmit(
  input: PortalCalculatorInput,
  defaults: Record<string, unknown> = {},
): CalculatorSubmitData {
  const energyType = input.energyType ?? "electro";
  return {
    energyType,
    clientType: input.customerType ?? "client_type_private",
    zip: input.zip,
    city: input.city,
    street: input.street,
    houseNumber: input.houseNumber,
    consumption: Math.round(input.consumptionKwh),
    consumptionNight: energyType === "electro" ? null : (defaults.consumptionNight as number | null) ?? null,
    electroType: energyType === "electro" ? "electro_type_normal" : null,
    gasType: energyType === "gas" ? ((defaults.gasType as string | null) ?? null) : null,
    priceDate: (defaults.priceDate as string | null) ?? null,
    additionalInfo: defaults.additionalInfo ?? null,
    selfPay: false,
    providerName: (defaults.providerName as string | null) ?? input.currentProviderName ?? null,
    providerCode: (defaults.providerCode as string | null) ?? null,
    cityProviderName: (defaults.cityProviderName as string | null) ?? null,
    cityProviderTariff: (defaults.cityProviderTariff as string | null) ?? null,
    compareMonthPrice: (defaults.cityProviderMonthPrice as number | null) ?? null,
    compareWorkPrice: (defaults.cityProviderWorkPrice as number | null) ?? null,
    compareWorkPriceNight: null,
  };
}

export function decodePortalTariffs(body: unknown): unknown[] | null {
  if (!body || typeof body !== "object") return null;
  const tariffs = (body as { tariffs?: unknown }).tariffs;
  if (typeof tariffs !== "string") return null;
  try {
    const json = Buffer.from(tariffs, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function redactSecrets<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => redactSecrets(item)) as T;
  if (!value || typeof value !== "object") return value;
  const copy: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    copy[key] = /token|password|secret|authorization/i.test(key) ? "<REDACTED>" : redactSecrets(child);
  }
  return copy as T;
}

export function summarizePortalBody(body: unknown, raw: string): unknown {
  const redacted = redactSecrets(body);
  if (typeof redacted === "object" && redacted !== null) {
    const record = redacted as Record<string, unknown>;
    const keys = Object.keys(record);
    return {
      keys,
      tariffsEncoded: typeof record.tariffs === "string",
      promotionTariffs: record.promotionTariffs ? "present" : undefined,
    };
  }
  const text = typeof body === "string" ? body : raw;
  return {
    length: text.length,
    preview: text.slice(0, 500),
    title: text.match(/<title>([^<]+)<\/title>/i)?.[1],
  };
}
