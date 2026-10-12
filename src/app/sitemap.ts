import { converters } from "@/lib/converters";
import { imageTools } from "@/lib/image/registry";
import { otherTools } from "@/lib/other/registry";
import { pdfTools } from "@/lib/pdf/registry";
import { textTools } from "@/lib/text/registry";
import { zipTools } from "@/lib/zip/registry";
import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/convert`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tools/pdf`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tools/image`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tools/text`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/tools/zip`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/tools/other`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  const mapSlugs = (prefix: string, slugs: string[]) =>
    slugs.map((slug) => ({
      url: `${BASE}${prefix}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...converters.map((c) => ({
      url: `${BASE}/convert/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...mapSlugs("/tools/pdf", pdfTools.map((t) => t.slug)),
    ...mapSlugs("/tools/image", imageTools.map((t) => t.slug)),
    ...mapSlugs("/tools/text", textTools.map((t) => t.slug)),
    ...mapSlugs("/tools/zip", zipTools.map((t) => t.slug)),
    ...mapSlugs("/tools/other", otherTools.map((t) => t.slug)),
  ];
}
