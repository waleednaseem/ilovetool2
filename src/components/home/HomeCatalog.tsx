"use client";

import ToolCard from "@/components/tools/ToolCard";
import { familyLabels, getAllCatalogTools, getHomeSections } from "@/lib/catalog";
import type { ToolFamily } from "@/lib/tools/types";
import Link from "next/link";
import { useMemo, useState } from "react";

const pills: Array<ToolFamily | "all"> = [
  "all",
  "pdf",
  "image",
  "text",
  "zip",
  "other",
  "convert",
];

export default function HomeCatalog() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<ToolFamily | "all">("all");
  const all = useMemo(() => getAllCatalogTools(), []);
  const sections = useMemo(() => getHomeSections(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((t) => {
      if (family !== "all" && t.family !== family) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [all, family, query]);

  const searching = query.trim().length > 0 || family !== "all";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 rounded-2xl border border-[var(--gray-border)] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="mb-4 w-full rounded-xl border border-[var(--gray-border)] bg-white px-4 py-3 text-sm outline-none ring-[var(--brand)] focus:ring-2"
        />
        <div className="flex flex-wrap gap-2">
          {pills.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFamily(id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                family === id
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--brand-soft)] text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
              }`}
            >
              {familyLabels[id]}
            </button>
          ))}
        </div>
      </div>

      {searching ? (
        <section>
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">
            {filtered.length} tool{filtered.length === 1 ? "" : "s"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((t) => (
              <ToolCard
                key={`${t.family}-${t.slug}`}
                href={t.href}
                title={t.title}
                description={t.description}
                icon={t.icon}
                family={t.family}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-[var(--gray-muted)]">No tools match your search.</p>
          )}
        </section>
      ) : (
        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.family}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  {section.title}
                </h2>
                <Link
                  href={section.href}
                  className="text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  See all →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {section.tools.map((t) => (
                  <ToolCard
                    key={t.slug}
                    href={t.href}
                    title={t.title}
                    description={t.description}
                    icon={t.icon}
                    family={t.family}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
