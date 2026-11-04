import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkTariffPricesBatch,
  enrichTariffs,
  loadNeueEnergieTariffCatalog,
  type TariffCheckInput,
} from "../lib/neue-energie.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "data", "neue-energie-preise-laura.json");

const input: TariffCheckInput = {
  street: "Wilsdruffer Str.",
  houseNumber: "15",
  zip: "01067",
  city: "Dresden",
  consumptionKwh: 1000,
  appointmentDate: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  })(),
  meterNumber: "1ZPA0020981184",
  contractType: "type_changing_provider",
  appointment: "appointment_next_possible",
  clientNumber: "836697713002",
  currentProviderName: "Vattenfall Europe Sales GmbH",
};

const catalog = await loadNeueEnergieTariffCatalog();
if (catalog.status !== "ok") {
  console.error(JSON.stringify({ ok: false, ...catalog }, null, 2));
  process.exit(1);
}

const stromPrivat = enrichTariffs(catalog.tariffs, catalog.companies).filter(
  (tariff) => tariff.energieart === "Strom" && tariff.kundentyp === "Privat",
);

const started = Date.now();
const quotes = await checkTariffPricesBatch(input, stromPrivat, 5);
const elapsedMs = Date.now() - started;

const ok = quotes.filter((q) => q.status === "ok");
ok.sort((a, b) => {
  const yearA =
    (a.basePriceEurYear ?? 0) + ((a.workingPriceCtKwh ?? 0) / 100) * input.consumptionKwh;
  const yearB =
    (b.basePriceEurYear ?? 0) + ((b.workingPriceCtKwh ?? 0) / 100) * input.consumptionKwh;
  return yearA - yearB;
});

const payload = {
  fetchedAt: new Date().toISOString(),
  elapsedMs,
  lead: {
    name: "Laura Urbaniak",
    street: input.street,
    houseNumber: input.houseNumber,
    zip: input.zip,
    city: input.city,
    consumptionKwh: input.consumptionKwh,
    currentProviderName: input.currentProviderName,
    contractType: input.contractType,
  },
  queried: quotes.length,
  withPrices: ok.length,
  failed: quotes.filter((q) => q.status === "failed").length,
  quotes,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(payload, null, 2));

const failures = quotes
  .filter((q) => q.status !== "ok")
  .reduce<Record<string, number>>((acc, q) => {
    const key = (q.errorMessage || q.skipReason || q.status).slice(0, 80);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

console.log(
  JSON.stringify(
    {
      ok: true,
      file: outFile,
      queried: quotes.length,
      withPrices: ok.length,
      failed: payload.failed,
      elapsedMs,
      cheapest: ok.slice(0, 8).map((q) => ({
        id: q.tariffId,
        company: q.companyName,
        name: q.name.trim(),
        typ: q.untertyp,
        grundpreis: q.basePriceEurYear,
        arbeitspreis: q.workingPriceCtKwh,
        jahr:
          Math.round(
            ((q.basePriceEurYear ?? 0) + ((q.workingPriceCtKwh ?? 0) / 100) * input.consumptionKwh) *
              100,
          ) / 100,
      })),
      failures,
    },
    null,
    2,
  ),
);
