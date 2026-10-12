import { converters } from "@/lib/converters";
import { imageTools } from "@/lib/image/registry";
import { otherTools } from "@/lib/other/registry";
import { getFeaturedPdfTools, pdfTools } from "@/lib/pdf/registry";
import { textTools } from "@/lib/text/registry";
import type { CatalogTool, ToolFamily } from "@/lib/tools/types";
import { zipTools } from "@/lib/zip/registry";

export const familyLabels: Record<ToolFamily | "all", string> = {
  all: "All",
  pdf: "PDF",
  image: "Image",
  text: "Text",
  zip: "ZIP",
  other: "Other",
  convert: "Converters",
};

export function getAllCatalogTools(): CatalogTool[] {
  const pdf: CatalogTool[] = pdfTools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    family: "pdf",
    href: `/tools/pdf/${t.slug}`,
    icon: "PDF",
    featured: t.featured,
  }));

  const image: CatalogTool[] = imageTools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    family: "image",
    href: `/tools/image/${t.slug}`,
    icon: "IMG",
    featured: t.featured,
  }));

  const text: CatalogTool[] = textTools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    family: "text",
    href: `/tools/text/${t.slug}`,
    icon: "TXT",
    featured: t.featured,
  }));

  const zip: CatalogTool[] = zipTools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    family: "zip",
    href: `/tools/zip/${t.slug}`,
    icon: "ZIP",
    featured: t.featured,
  }));

  const other: CatalogTool[] = otherTools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    family: "other",
    href: `/tools/other/${t.slug}`,
    icon: "APP",
    featured: t.featured,
  }));

  const convert: CatalogTool[] = converters.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    family: "convert",
    href: `/convert/${c.slug}`,
    icon: c.fromUnit.slice(0, 3).toUpperCase(),
    featured: c.featured,
  }));

  return [...pdf, ...image, ...text, ...zip, ...other, ...convert];
}

export function getHomeSections() {
  return [
    {
      family: "pdf" as const,
      title: "PDF Tools",
      href: "/tools/pdf",
      tools: getFeaturedPdfTools().map((t) => ({
        slug: t.slug,
        title: t.title,
        description: t.description,
        family: "pdf" as const,
        href: `/tools/pdf/${t.slug}`,
        icon: "PDF",
        featured: t.featured,
      })),
    },
    {
      family: "image" as const,
      title: "Image Tools",
      href: "/tools/image",
      tools: imageTools
        .filter((t) => t.featured)
        .map((t) => ({
          slug: t.slug,
          title: t.title,
          description: t.description,
          family: "image" as const,
          href: `/tools/image/${t.slug}`,
          icon: "IMG",
          featured: true,
        })),
    },
    {
      family: "text" as const,
      title: "Text Tools",
      href: "/tools/text",
      tools: textTools.map((t) => ({
        slug: t.slug,
        title: t.title,
        description: t.description,
        family: "text" as const,
        href: `/tools/text/${t.slug}`,
        icon: "TXT",
        featured: t.featured,
      })),
    },
    {
      family: "zip" as const,
      title: "ZIP Tools",
      href: "/tools/zip",
      tools: zipTools.map((t) => ({
        slug: t.slug,
        title: t.title,
        description: t.description,
        family: "zip" as const,
        href: `/tools/zip/${t.slug}`,
        icon: "ZIP",
        featured: t.featured,
      })),
    },
    {
      family: "other" as const,
      title: "Other Tools",
      href: "/tools/other",
      tools: otherTools.map((t) => ({
        slug: t.slug,
        title: t.title,
        description: t.description,
        family: "other" as const,
        href: `/tools/other/${t.slug}`,
        icon: "APP",
        featured: t.featured,
      })),
    },
    {
      family: "convert" as const,
      title: "Unit Converters",
      href: "/convert",
      tools: converters
        .filter((c) => c.featured)
        .slice(0, 6)
        .map((c) => ({
          slug: c.slug,
          title: c.title,
          description: c.description,
          family: "convert" as const,
          href: `/convert/${c.slug}`,
          icon: c.fromUnit.slice(0, 3).toUpperCase(),
          featured: true,
        })),
    },
  ];
}
