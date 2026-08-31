import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  enrichTariffs,
  loadNeueEnergieTariffCatalog,
  type EnrichedTariff,
} from "../lib/neue-energie.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "data", "neue-energie-tarife.json");

function groupCount(tariffs: EnrichedTariff[], key: keyof EnrichedTariff): Record<string, number> {
  return tariffs.reduce<Record<string, number>>((acc, tariff) => {
    const value = String(tariff[key]);
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

const catalog = await loadNeueEnergieTariffCatalog();

if (catalog.status !== "ok") {
  console.error(JSON.stringify({ ok: false, ...catalog }, null, 2));
  process.exit(1);
}

const enriched = enrichTariffs(catalog.tariffs, catalog.companies).sort((a, b) => {
  if (a.energieart !== b.energieart) return a.energieart.localeCompare(b.energieart, "de");
  if (a.kundentyp !== b.kundentyp) return a.kundentyp.localeCompare(b.kundentyp, "de");
  if (a.companyName !== b.companyName) return a.companyName.localeCompare(b.companyName, "de");
  return a.name.localeCompare(b.name, "de");
});

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  JSON.stringify(
    {
      fetchedAt: catalog.fetchedAt,
      total: enriched.length,
      companies: catalog.companies.length,
      tariffs: enriched,
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    {
      ok: true,
      file: outFile,
      total: enriched.length,
      companies: catalog.companies.length,
      groups: {
        energieart: groupCount(enriched, "energieart"),
        kundentyp: groupCount(enriched, "kundentyp"),
        untertyp: groupCount(enriched, "untertyp"),
      },
      stromPrivatStandard: enriched.filter(
        (t) => t.energieart === "Strom" && t.kundentyp === "Privat" && t.untertyp === "Standard",
      ).length,
      sample: enriched
        .filter((t) => t.energieart === "Strom" && t.kundentyp === "Privat" && t.untertyp === "Standard")
        .slice(0, 10)
        .map((t) => ({ id: t.id, name: t.name, companyName: t.companyName })),
    },
    null,
    2,
  ),
);
