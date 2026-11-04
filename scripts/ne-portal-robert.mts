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
  toJqueryForm,
  type PortalCalculatorInput,
  type PortalRequestResult,
} from "../lib/neue-energie-portal.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = join(root, ".env.local");
const outDir = join(root, "data", "ne-portal-robert");

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

function nestedRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function pickTariffSummary(tariff: unknown): Record<string, unknown> | null {
  if (!tariff || typeof tariff !== "object") return null;
  const record = tariff as Record<string, unknown>;
  const nested = nestedRecord(record.futuramaTariff);
  const calc = nestedRecord(record.calculator ?? nested.calculator);
  const provision = nestedRecord(nested.provision ?? record.provision);
  const yearCost = () => {
    const gp = Number(calc.basePrice ?? nested.basePrice);
    const ap = Number(calc.workingPrice ?? nested.workingPrice);
    if (!Number.isFinite(gp) || !Number.isFinite(ap)) return null;
    return Math.round((gp + (ap / 100) * 1750) * 100) / 100;
  };
  return {
    id: record.id ?? nested.id,
    name: String(record.name ?? nested.name ?? record.tariffName ?? "").replace(/\s+/g, " ").trim(),
    providerName: record.providerName ?? nested.providerName,
    provision: provision.cost ?? provision.amount ?? nested.provision ?? record.provision,
    bonus: calc.bonus ?? nested.bonus ?? record.bonus,
    bonusLoyalty: calc.bonusLoyalty ?? nested.bonusLoyalty ?? record.bonusLoyalty,
    bonusInstant: calc.bonusInstant ?? nested.bonusInstant ?? record.bonusInstant,
    workingBonus: calc.workingBonus,
    workingPrice: calc.workingPrice ?? nested.workingPrice,
    basePrice: calc.basePrice ?? nested.basePrice,
    jahr: yearCost(),
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
  street: "Pfotenhauerstr.",
  houseNumber: "50",
  zip: "01307",
  city: "Dresden",
  consumptionKwh: 1750,
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
      { ok: false, error: login.error, url: login.result?.url, status: login.result?.status },
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

const rows = (decoded ?? []).map(pickTariffSummary).filter(Boolean) as Array<Record<string, unknown>>;
rows.sort((a, b) => Number(a.jahr ?? 9e9) - Number(b.jahr ?? 9e9));
writeJson("tariffs-summary", rows);

const watch = new Set(["91", "217", "993", "1028", "1029", "1030", "1044", "1085", "1318", "973"]);
const highlight = rows.filter((row) => watch.has(String(row.id)));

console.log(
  JSON.stringify(
    {
      ok: tariffs.status < 400 && (decoded?.length ?? 0) > 0,
      decoded: decoded?.length ?? 0,
      loginUrl: calculatorPage.url,
      loadModelsStatus: loadModels.status,
      tariffsStatus: tariffs.status,
      highlight,
      cheapest: rows.slice(0, 12),
    },
    null,
    2,
  ),
);
