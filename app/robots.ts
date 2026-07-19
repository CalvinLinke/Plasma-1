import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// KI-/Answer-Engine-Crawler bewusst erlauben, damit Inhalte in KI-Antworten
// (ChatGPT, Claude, Perplexity, Google AI Overviews) zitiert werden können.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
