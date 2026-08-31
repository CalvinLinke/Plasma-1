import type { InvoiceAnalysis } from "@/lib/invoice-parse";

export const DEFAULT_TARIFF_ID = "531";

export type NeueEnergieTariff = {
  id: number;
  companyId: number;
  name: string;
  tariffType: number;
  tariffSubType: number;
  customerType: number;
};

export type NeueEnergieCompany = {
  id: number;
  name: string;
  logo: string | null;
};

export type NeueEnergieTariffListResult = {
  status: "ok" | "failed" | "skipped";
  tariffs: NeueEnergieTariff[];
  companies: NeueEnergieCompany[];
  fetchedAt: string;
  errorMessage?: string;
  skipReason?: string;
};

export type EnrichedTariff = NeueEnergieTariff & {
  companyName: string;
  energieart: "Strom" | "Gas" | "Unbekannt";
  kundentyp: "Privat" | "Gewerbe" | "Unbekannt";
  untertyp: "Standard" | "Wärmepumpe" | "Nachtspeicher" | "Unbekannt";
};

export type TariffCheckInput = {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  consumptionKwh: number;
  appointmentDate: string;
  meterNumber: string;
  contractType?: "type_move" | "type_changing_provider";
  appointment?: "appointment_next_possible" | "appointment_exact_date";
  clientNumber?: string;
  currentProviderName?: string;
};

export type TariffCheckResult = {
  status: "ok" | "skipped" | "failed";
  tariffId: string;
  basePriceEurYear?: number;
  workingPriceCtKwh?: number;
  errorMessage?: string;
  skipReason?: string;
};

function config(): { baseUri: string; apiKey: string; testMode: string; tariffId: string } | null {
  const baseUri = process.env.NEUE_ENERGIE_BASE_URI;
  const apiKey = process.env.NEUE_ENERGIE_API_KEY;
  if (!baseUri || !apiKey) return null;
  return {
    baseUri: baseUri.replace(/\/$/, ""),
    apiKey,
    testMode: process.env.NEUE_ENERGIE_TEST_MODE || "1",
    tariffId: process.env.NEUE_ENERGIE_TARIFF_ID || DEFAULT_TARIFF_ID,
  };
}

type ApiEnvelope<T> = {
  result?: T;
  error?: boolean;
  description?: string;
  code?: number;
};

async function postNeueEnergie<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const cfg = config();
  if (!cfg) {
    return { ok: false, error: "NEUE_ENERGIE_BASE_URI oder NEUE_ENERGIE_API_KEY fehlt" };
  }

  let response: Response;
  try {
    response = await fetch(`${cfg.baseUri}${path}`, {
      method: "POST",
      headers: { authorization: `Bearer ${cfg.apiKey}` },
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Netzwerkfehler",
    };
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await response.json()) as ApiEnvelope<T>;
  } catch {
    return { ok: false, error: `Antwort nicht lesbar (HTTP ${response.status})` };
  }

  if (body.error === true) {
    return {
      ok: false,
      error: body.description ?? `API-Fehler (HTTP ${response.status})`,
    };
  }

  if (!body.result) {
    return { ok: false, error: "Antwort ohne result-Feld" };
  }

  return { ok: true, data: body.result };
}

export function energieartLabel(tariffType: number): EnrichedTariff["energieart"] {
  if (tariffType === 1) return "Strom";
  if (tariffType === 2) return "Gas";
  return "Unbekannt";
}

export function kundentypLabel(customerType: number): EnrichedTariff["kundentyp"] {
  if (customerType === 1) return "Privat";
  if (customerType === 2) return "Gewerbe";
  return "Unbekannt";
}

export function tariffSubTypeLabel(tariffSubType: number): EnrichedTariff["untertyp"] {
  if (tariffSubType === 0) return "Standard";
  if (tariffSubType === 1) return "Wärmepumpe";
  if (tariffSubType === 2) return "Nachtspeicher";
  return "Unbekannt";
}

export function enrichTariffs(
  tariffs: NeueEnergieTariff[],
  companies: NeueEnergieCompany[],
): EnrichedTariff[] {
  const companyById = new Map(companies.map((company) => [company.id, company.name]));

  return tariffs.map((tariff) => ({
    ...tariff,
    companyName: companyById.get(tariff.companyId) ?? `Unbekannt (${tariff.companyId})`,
    energieart: energieartLabel(tariff.tariffType),
    kundentyp: kundentypLabel(tariff.customerType),
    untertyp: tariffSubTypeLabel(tariff.tariffSubType),
  }));
}

export async function fetchCompanies(): Promise<
  { status: "ok"; companies: NeueEnergieCompany[] } | { status: "failed" | "skipped"; errorMessage: string }
> {
  const result = await postNeueEnergie<NeueEnergieCompany[]>("/companies");
  if (!result.ok) {
    return {
      status: config() ? "failed" : "skipped",
      errorMessage: result.error,
    };
  }
  return { status: "ok", companies: result.data };
}

export async function fetchTariffs(): Promise<
  { status: "ok"; tariffs: NeueEnergieTariff[] } | { status: "failed" | "skipped"; errorMessage: string }
> {
  const result = await postNeueEnergie<NeueEnergieTariff[]>("/tariffs");
  if (!result.ok) {
    return {
      status: config() ? "failed" : "skipped",
      errorMessage: result.error,
    };
  }
  return { status: "ok", tariffs: result.data };
}

export async function loadNeueEnergieTariffCatalog(): Promise<NeueEnergieTariffListResult> {
  const fetchedAt = new Date().toISOString();

  const [tariffRes, companyRes] = await Promise.all([fetchTariffs(), fetchCompanies()]);

  if (tariffRes.status !== "ok") {
    return {
      status: tariffRes.status,
      tariffs: [],
      companies: [],
      fetchedAt,
      errorMessage: tariffRes.errorMessage,
      skipReason: tariffRes.status === "skipped" ? tariffRes.errorMessage : undefined,
    };
  }

  const companies = companyRes.status === "ok" ? companyRes.companies : [];

  return {
    status: "ok",
    tariffs: tariffRes.tariffs,
    companies,
    fetchedAt,
    errorMessage: companyRes.status !== "ok" ? companyRes.errorMessage : undefined,
  };
}

function formatGermanDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const year = parts.find((p) => p.type === "year")?.value ?? "2026";
  return `${day}.${month}.${year}`;
}

function defaultAppointmentDate(): string {
  const days = Number(process.env.NEUE_ENERGIE_APPOINTMENT_DAYS || 14);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatGermanDate(date);
}

function parsePrice(value: string): number | undefined {
  const num = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(num) ? num : undefined;
}

function getPricesFromResponse(response: unknown): { basePrice: string; workingPrice: string } | null {
  if (!response || typeof response !== "object") return null;
  const record = response as { error?: boolean; description?: string };
  if (typeof record.description !== "string") return null;

  const pair = record.description.match(
    /\[(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\]/,
  );
  if (pair) {
    return { basePrice: pair[1], workingPrice: pair[2] };
  }

  return null;
}

function getCorrectedFieldPrice(response: unknown, field: "basePrice" | "workingPrice"): string | null {
  if (!response || typeof response !== "object") return null;
  const record = response as { description?: string };
  if (typeof record.description !== "string") return null;
  const match = record.description.match(
    new RegExp(`Invalid ${field}, correct value:\\s*(\\d+(?:\\.\\d+)?)`, "i"),
  );
  return match?.[1] ?? null;
}

function isInvalidStreetResponse(response: unknown): boolean {
  if (!response || typeof response !== "object") return false;
  const record = response as { error?: boolean; code?: number; description?: string };
  return (
    record.error === true &&
    record.code === 4 &&
    typeof record.description === "string" &&
    record.description.includes("field: street, message: Invalid street")
  );
}

function buildValidationFormData(
  input: TariffCheckInput,
  tariffId: string,
  testMode: string,
  prices?: { basePrice: string; workingPrice: string },
): FormData {
  const formData = new FormData();
  const body: Record<string, string | boolean> = {
    ref: "",
    consumption: String(Math.round(input.consumptionKwh)),
    street: input.street,
    houseNumber: input.houseNumber,
    zip: input.zip,
    city: input.city,
    salutation: "salutation_mr",
    firstname: "Max",
    lastname: "Mustermann",
    birthday: "01.01.1990",
    secondOwner: false,
    secondOwnerSalutation: "salutation_mr",
    billing: false,
    billingFirstname: "Max",
    billingLastname: "Mustermann",
    billingZip: input.zip,
    billingCity: input.city,
    billingStreet: input.street,
    billingHouseNumber: input.houseNumber,
    billingSalutation: "salutation_mr",
    billingEmail: "",
    billingPhoneCode: "",
    billingPhone: "",
    accountDelivery: "account_delivery_email",
    email: "tarifcheck@plasma-energie.de",
    phoneCode: "0172",
    phone: "0000000",
    appointmentDate: input.appointmentDate,
    meterNumber: input.meterNumber,
    individualPayment: false,
    accountHolder: "Max Mustermann",
    iban: "",
    privacyAccepted: true,
    basePrice: prices?.basePrice ?? "10.00",
    workingPrice: prices?.workingPrice ?? "20.00",
    neueEnergieAddressValidationError: "",
  };

  const contractType = input.contractType ?? "type_changing_provider";

  for (const [key, value] of Object.entries(body)) {
    formData.set(key, String(value));
  }

  formData.set("testMode", testMode);
  formData.set("tariffId", tariffId);
  formData.set("type", contractType);
  if (contractType === "type_changing_provider") {
    formData.set("appointment", input.appointment ?? "appointment_next_possible");
    if (input.clientNumber) formData.set("clientNumber", input.clientNumber);
    if (input.currentProviderName) {
      formData.set("currentProviderName", input.currentProviderName);
    }
  }
  formData.set("priceDate", formatGermanDate(new Date()));
  formData.set("externalId", process.env.NEUE_ENERGIE_EXTERNAL_ID || "13120");

  return formData;
}

export type LeadForTariffCheck = {
  plz: string;
  ort: string;
  analysis?: InvoiceAnalysis;
};

export function buildTariffCheckInput(lead: LeadForTariffCheck): TariffCheckInput | null {
  const analysis = lead.analysis;
  const street = analysis?.strasse?.trim();
  const houseNumber = analysis?.hausnummer?.trim();
  const zip = (lead.plz || analysis?.plz || "").trim().slice(0, 5);
  const city = (lead.ort || analysis?.ort || "").split(/\n/)[0].trim();

  if (!street || !houseNumber || !/^\d{5}$/.test(zip) || city.length < 2) {
    return null;
  }

  const consumptionKwh =
    analysis?.verbrauchKwh ??
    Number(process.env.NEUE_ENERGIE_DEFAULT_CONSUMPTION_KWH || 2500);

  return {
    street,
    houseNumber,
    zip,
    city,
    consumptionKwh: Number.isFinite(consumptionKwh) ? consumptionKwh : 2500,
    appointmentDate: defaultAppointmentDate(),
    meterNumber: analysis?.zaehlernummer?.trim() || "00000000",
  };
}

export async function checkTariffPrices(
  input: TariffCheckInput,
  tariffId?: string,
): Promise<TariffCheckResult> {
  const cfg = config();
  const resolvedTariffId = tariffId || cfg?.tariffId || process.env.NEUE_ENERGIE_TARIFF_ID || DEFAULT_TARIFF_ID;
  if (!cfg) {
    return {
      status: "skipped",
      tariffId: resolvedTariffId,
      skipReason: "NEUE_ENERGIE_BASE_URI oder NEUE_ENERGIE_API_KEY fehlt",
    };
  }

  async function postContract(prices: { basePrice: string; workingPrice: string }): Promise<unknown> {
    const response = await fetch(`${cfg.baseUri}/contracts`, {
      method: "POST",
      headers: { authorization: `Bearer ${cfg.apiKey}` },
      body: buildValidationFormData(input, resolvedTariffId, cfg.testMode, prices),
    });
    return response.json();
  }

  let responseData: unknown;
  try {
    responseData = await postContract({ basePrice: "10.00", workingPrice: "20.00" });
  } catch (error) {
    return {
      status: "failed",
      tariffId: resolvedTariffId,
      errorMessage: error instanceof Error ? error.message : "Netzwerkfehler",
    };
  }

  if (isInvalidStreetResponse(responseData)) {
    return {
      status: "failed",
      tariffId: resolvedTariffId,
      errorMessage: "Adresse von Neue Energie abgelehnt",
    };
  }

  let prices = getPricesFromResponse(responseData);
  let knownBase = prices?.basePrice ?? getCorrectedFieldPrice(responseData, "basePrice");
  let knownWork = prices?.workingPrice ?? getCorrectedFieldPrice(responseData, "workingPrice");

  if (!prices && knownBase) {
    try {
      responseData = await postContract({ basePrice: knownBase, workingPrice: knownWork ?? "20.00" });
      prices = getPricesFromResponse(responseData);
      knownBase = prices?.basePrice ?? knownBase;
      knownWork = prices?.workingPrice ?? getCorrectedFieldPrice(responseData, "workingPrice") ?? knownWork;
    } catch (error) {
      return {
        status: "failed",
        tariffId: resolvedTariffId,
        errorMessage: error instanceof Error ? error.message : "Netzwerkfehler",
      };
    }
  }

  if (!prices && knownBase && knownWork) {
    prices = { basePrice: knownBase, workingPrice: knownWork };
  }

  if (prices) {
    return {
      status: "ok",
      tariffId: resolvedTariffId,
      basePriceEurYear: parsePrice(prices.basePrice),
      workingPriceCtKwh: parsePrice(prices.workingPrice),
    };
  }

  const description =
    responseData &&
    typeof responseData === "object" &&
    "description" in responseData &&
    typeof (responseData as { description: unknown }).description === "string"
      ? (responseData as { description: string }).description
      : "Antwort ohne Preise";

  return {
    status: "failed",
    tariffId: resolvedTariffId,
    errorMessage: description,
  };
}

export async function checkTariffForLead(lead: LeadForTariffCheck): Promise<TariffCheckResult> {
  const input = buildTariffCheckInput(lead);
  if (!input) {
    return {
      status: "skipped",
      tariffId: process.env.NEUE_ENERGIE_TARIFF_ID || DEFAULT_TARIFF_ID,
      skipReason: "Adresse oder Verbrauch für Tarifprüfung unvollständig",
    };
  }
  return checkTariffPrices(input);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export type TariffPriceQuote = TariffCheckResult & {
  name: string;
  companyName: string;
  energieart: EnrichedTariff["energieart"];
  kundentyp: EnrichedTariff["kundentyp"];
  untertyp: EnrichedTariff["untertyp"];
};

export async function checkTariffPricesBatch(
  input: TariffCheckInput,
  tariffs: EnrichedTariff[],
  concurrency = 5,
): Promise<TariffPriceQuote[]> {
  return mapWithConcurrency(tariffs, concurrency, async (tariff) => {
    const result = await checkTariffPrices(input, String(tariff.id));
    return {
      ...result,
      name: tariff.name,
      companyName: tariff.companyName,
      energieart: tariff.energieart,
      kundentyp: tariff.kundentyp,
      untertyp: tariff.untertyp,
    };
  });
}
