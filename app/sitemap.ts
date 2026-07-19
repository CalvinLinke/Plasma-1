import type { MetadataRoute } from "next";
import { getAllPagesMeta } from "@/lib/content";
import { siteConfig } from "@/lib/site";

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

// Bestehende, handkodierte Seiten (ohne noindex /tonym).
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: ChangeFreq }> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/leistungen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leistungen/privatkunden", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leistungen/gewerbekunden", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leistungen/hausverwaltungen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/angebot-erhalten", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ueber-uns", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partner-werden", priority: 0.6, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.6, changeFrequency: "monthly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
  { path: "/agb", priority: 0.2, changeFrequency: "yearly" },
];

const SILO_ROOTS = new Set(["ratgeber", "wechseln", "tarife"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteConfig.url}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const contentEntries: MetadataRoute.Sitemap = getAllPagesMeta()
    .filter((p) => !p.canonical) // Canonical-Override → nicht in Sitemap
    .map((p) => {
      const isRoot = SILO_ROOTS.has(p.slug);
      const dateStr = p.dateModified || p.datePublished;
      return {
        url: `${siteConfig.url}/${p.slug}`,
        lastModified: dateStr ? new Date(dateStr) : now,
        changeFrequency: (isRoot ? "weekly" : "monthly") as ChangeFreq,
        priority: isRoot ? 0.9 : 0.8,
      };
    });

  return [...staticEntries, ...contentEntries];
}
