import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildCalculatorSubmit,
  decodePortalTariffs,
  loadPortalConfig,
  loginNeueEnergiePortal,
  portalGet,
  portalPost,
  redactSecrets,
  summarizePortalBody,
  toJqueryForm,
  type PortalCalculatorInput,
  type PortalRequestResult,
} from "../lib/neue-energie-portal.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = join(root, ".env.local");
const outDir = join(root, "data", "ne-portal-laura");

function loadEnvLocal(): void {
  if (!existsSync(envFile)) return;
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function writeJson(name: string, value: unknown): void {
  writeFileSync(join(outDir, `${name}.json`), JSON.stringify(value, null, 2));
}

function writeCapture(name: string, result: PortalRequestResult): void {
  const isJson = result.contentType.includes("json") || typeof result.body === "object";
  const file = join(outDir, isJson ? `${name}.json` : `${name}.html`);
  const payload =
    typeof result.body === "object" && result.body !== null
      ? {
          url: result.url,
          status: result.status,
          contentType: result.contentType,
          body: redactSecrets(result.body),
        }
      : result.raw;
  writeFileSync(file, typeof payload === "string" ? payload : JSON.stringify(payload, null, 2));
}

function pickTariffSummary(tariff: unknown): Record<string, unknown> | null {
  if (!tariff || typeof tariff !== "object") return null;
  const record = tariff as Record<string, unknown>;
  const calc =
    record.calculator && typeof record.calculator === "object"
      ? (record.calculator as Record<string, unknown>)
      : record.futuramaTariff &&
          typeof record.futuramaTariff === "object" &&
          (record.futuramaTariff as Record<string, unknown>).calculator &&
          typeof (record.futuramaTariff as Record<string, unknown>).calculator === "object"
        ? ((record.futuramaTariff as Record<string, unknown>).calculator as Record<string, unknown>)
        : record;
  const nested =
    record.futuramaTariff && typeof record.futuramaTariff === "object"
      ? (record.futuramaTariff as Record<string, unknown>)
      : record;
  return {
    id: record.id ?? nested.id,
    name: record.name ?? nested.name ?? record.tariffName,
    providerName: record.providerName ?? nested.providerName,
    provision: nested.provision ?? record.provision,
    bonus: calc.bonus ?? nested.bonus ?? record.bonus,
    bonusLoyalty: calc.bonusLoyalty ?? nested.bonusLoyalty ?? record.bonusLoyalty,
    bonusInstant: calc.bonusInstant ?? nested.bonusInstant ?? record.bonusInstant,
    workingBonus: calc.workingBonus,
    workingPrice: calc.workingPrice ?? nested.workingPrice,
    basePrice: calc.basePrice ?? nested.basePrice,
    basePriceMonth: calc.basePriceMonth,
  };
}

loadEnvLocal();

const config = loadPortalConfig();
if ("error" in config) {
  console.error(JSON.stringify({ ok: false, error: config.error }, null, 2));
  process.exit(1);
}

config.sessionFile = join(root, "data", "ne-portal-session.json");

const input: PortalCalculatorInput = {
  street: "Wilsdruffer Str.",
  houseNumber: "15",
  zip: "01067",
  city: "Dresden",
  consumptionKwh: 1000,
  energyType: "electro",
  customerType: "client_type_private",
  contractType: "type_changing_provider",
  currentProviderName: "Vattenfall Europe Sales GmbH",
};

const login = await loginNeueEnergiePortal(config);
if (!login.ok) {
  mkdirSync(outDir, { recursive: true });
  if (login.result) writeCapture("login-failed", login.result);
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: login.error,
        url: login.result?.url,
        status: login.result?.status,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const calculatorPage = await portalGet(config, login.session, "/partner-area/calculator/");
writeCapture("calculator-page", calculatorPage);

const loadModels = await portalGet(
  config,
  login.session,
  "/partner-area/calculator/load-models?appCase=CASE_CREATE&copied=false",
  true,
);
writeCapture("load-models", loadModels);

const models =
  loadModels.body && typeof loadModels.body === "object"
    ? (loadModels.body as Record<string, unknown>)
    : {};
const calculatorModel =
  models.calculatorModel && typeof models.calculatorModel === "object"
    ? (models.calculatorModel as Record<string, unknown>)
    : {};
const submit = buildCalculatorSubmit(input, calculatorModel);
const tariffs = await portalPost(
  config,
  login.session,
  "/partner-area/calculator/tariffs",
  toJqueryForm({ calculator: submit }),
);
writeCapture("tariffs", tariffs);

const decoded = decodePortalTariffs(tariffs.body);
if (decoded) writeJson("tariffs-decoded", decoded);

const apiServiceUrl = typeof models.apiServiceUrl === "string" ? models.apiServiceUrl : "";
const apiServiceToken = typeof models.apiServiceToken === "string" ? models.apiServiceToken : "";
const partnerNumber = models.partnerNumber;
let externalCount = 0;
if (apiServiceUrl && apiServiceToken) {
  const url = new URL("external/calculators/tariffs", apiServiceUrl.endsWith("/") ? apiServiceUrl : `${apiServiceUrl}/`);
  for (const [key, value] of Object.entries(submit)) {
    if (value === null || value === undefined) continue;
    url.searchParams.append(`calculator[${key}]`, String(value));
  }
  url.searchParams.append("partnerNumber", String(partnerNumber ?? ""));
  url.searchParams.append("token", apiServiceToken);
  url.searchParams.append("calculator[project]", "NE");
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "PlasmaEnergiePortalBot/0.1" },
  });
  const raw = await response.text();
  let body: unknown = raw;
  try {
    body = JSON.parse(raw);
  } catch {
    /* keep text */
  }
  writeJson("external-calculators-tariffs", {
    status: response.status,
    url: url.origin + url.pathname,
    count: Array.isArray(body) ? body.length : undefined,
    body: redactSecrets(body),
  });
  externalCount = Array.isArray(body) ? body.length : 0;
}

const sample = (decoded ?? []).slice(0, 5).map(pickTariffSummary);

console.log(
  JSON.stringify(
    {
      ok: tariffs.status < 400,
      outDir,
      loginUrl: calculatorPage.url,
      dumps: {
        calculatorPage: { status: calculatorPage.status, url: calculatorPage.url },
        loadModels: {
          status: loadModels.status,
          keys:
            loadModels.body && typeof loadModels.body === "object"
              ? Object.keys(loadModels.body as object)
              : summarizePortalBody(loadModels.body, loadModels.raw),
        },
        tariffs: {
          status: tariffs.status,
          decoded: decoded?.length ?? 0,
          sample,
        },
        externalCalculators: { count: externalCount },
      },
    },
    null,
    2,
  ),
);
