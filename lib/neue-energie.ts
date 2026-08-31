import type { InvoiceAnalysis } from "@/lib/invoice-parse";

export const DEFAULT_TARIFF_ID = "531";

export type TariffCheckInput = {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  consumptionKwh: number;
  appointmentDate: string;
  meterNumber: string;
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
  if (record.error !== true || typeof record.description !== "string") return null;
  if (!record.description.includes("Invalid basePrice or workingPrice")) return null;

  const match = record.description.match(/\[(\d+\.\d+),\s*(\d+\.\d+)\]/);
  if (!match) return null;
  return { basePrice: match[1], workingPrice: match[2] };
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

function buildValidationFormData(input: TariffCheckInput, tariffId: string, testMode: string): FormData {
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
    basePrice: "10.00",
    workingPrice: "20.00",
    neueEnergieAddressValidationError: "",
  };

  for (const [key, value] of Object.entries(body)) {
    formData.set(key, String(value));
  }

  formData.set("testMode", testMode);
  formData.set("tariffId", tariffId);
  formData.set("type", "type_move");
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
  const zip = (lead.plz || analysis?.plz || "").trim();
  const city = (lead.ort || analysis?.ort || "").trim();

  if (!street || !houseNumber || !/^\d{5}$/.test(zip) || !city) {
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

export async function checkTariffPrices(input: TariffCheckInput): Promise<TariffCheckResult> {
  const cfg = config();
  if (!cfg) {
    return {
      status: "skipped",
      tariffId: process.env.NEUE_ENERGIE_TARIFF_ID || DEFAULT_TARIFF_ID,
      skipReason: "NEUE_ENERGIE_BASE_URI oder NEUE_ENERGIE_API_KEY fehlt",
    };
  }

  const formData = buildValidationFormData(input, cfg.tariffId, cfg.testMode);

  let response: Response;
  try {
    response = await fetch(`${cfg.baseUri}/contracts`, {
      method: "POST",
      headers: { authorization: `Bearer ${cfg.apiKey}` },
      body: formData,
    });
  } catch (error) {
    return {
      status: "failed",
      tariffId: cfg.tariffId,
      errorMessage: error instanceof Error ? error.message : "Netzwerkfehler",
    };
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    return {
      status: "failed",
      tariffId: cfg.tariffId,
      errorMessage: `Antwort nicht lesbar (HTTP ${response.status})`,
    };
  }

  if (isInvalidStreetResponse(responseData)) {
    return {
      status: "failed",
      tariffId: cfg.tariffId,
      errorMessage: "Adresse von Neue Energie abgelehnt",
    };
  }

  const prices = getPricesFromResponse(responseData);
  if (prices) {
    return {
      status: "ok",
      tariffId: cfg.tariffId,
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
      : `HTTP ${response.status}`;

  return {
    status: "failed",
    tariffId: cfg.tariffId,
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
