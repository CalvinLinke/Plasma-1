import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import type { Page, PageMeta, ContentSection } from "./types";

// Einsprachig (DE): alle Inhalte liegen flach unter content/ (z. B.
// content/ratgeber/…, content/wechseln/…, content/tarife/…).
const contentRoot = path.join(process.cwd(), "content");

function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function filePathToSlug(filePath: string): string {
  return path
    .relative(contentRoot, filePath)
    .replace(/\.md$/, "")
    .replace(/\/index$/, "")
    .replace(/^index$/, "");
}

/** Alle Content-Slugs als Segment-Arrays (für generateStaticParams). */
export function getAllSlugs(): string[][] {
  return getAllMarkdownFiles(contentRoot)
    .map(filePathToSlug)
    .filter((slug) => slug !== "")
    .map((slug) => slug.split("/"));
}

/** Kompakte Meta-Liste aller Seiten (für Sitemap/llms.txt). */
export function getAllPagesMeta(): Array<{
  slug: string;
  title?: string;
  description?: string;
  dateModified?: string;
  datePublished?: string;
  kategorie?: string;
  canonical?: string;
}> {
  return getAllMarkdownFiles(contentRoot)
    .map((filePath) => {
      const slug = filePathToSlug(filePath);
      if (!slug) return null;
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      return {
        slug,
        title: data.title as string | undefined,
        description: data.description as string | undefined,
        dateModified: data.dateModified as string | undefined,
        datePublished: data.datePublished as string | undefined,
        kategorie: data.kategorie as string | undefined,
        canonical: data.canonical as string | undefined,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export async function getPageBySlug(slugParts: string[]): Promise<Page | null> {
  const slug = slugParts.join("/");
  const candidates = [
    path.join(contentRoot, `${slug}.md`),
    path.join(contentRoot, slug, "index.md"),
  ];

  let filePath: string | null = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      filePath = c;
      break;
    }
  }
  if (!filePath) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  const processed = await remark()
    .use(gfm)
    .use(html, { allowDangerousHtml: true })
    .process(content);

  const meta = data as PageMeta;
  // AEO: fehlt die Direktantwort, aus der ersten FAQ ableiten (100 % Abdeckung).
  if (!meta.direktantwort && Array.isArray(meta.faqs) && meta.faqs.length > 0) {
    meta.direktantwort = { frage: meta.faqs[0].frage, antwort: meta.faqs[0].antwort };
  }

  return { meta, content, htmlContent: processed.toString() };
}

/** Alle Seiten einer Kategorie (für Übersichts-Auto-Listings), nach Titel sortiert. */
export function getPagesByKategorie(kategorie: string): PageMeta[] {
  const pages: PageMeta[] = [];
  for (const f of getAllMarkdownFiles(contentRoot)) {
    const { data } = matter(fs.readFileSync(f, "utf-8"));
    if (data.kategorie === kategorie) pages.push(data as PageMeta);
  }
  return pages.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? "", "de"));
}

/**
 * Teilt gerendertes HTML an <h2>-Überschriften in geordnete Sektionen.
 * Gibt Intro (vor erster H2) + Sektionen zurück – für die Flagship-Templates.
 */
export function extractSections(htmlStr: string): {
  intro: string;
  sections: ContentSection[];
} {
  const parts = htmlStr.split(/(?=<h2[^>]*>)/i);
  const intro = parts[0]?.trim() || "";
  const sections: ContentSection[] = [];

  for (let i = intro ? 1 : 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    const headingMatch = part.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (!headingMatch) continue;
    const heading = headingMatch[1].replace(/<[^>]*>/g, "").trim();
    sections.push({ heading, content: part.slice(headingMatch[0].length).trim() });
  }

  return { intro, sections };
}
