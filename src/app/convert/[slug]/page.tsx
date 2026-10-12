import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ConverterForm from "@/components/tools/ConverterForm";
import ToolCard from "@/components/tools/ToolCard";
import {
  converters,
  getConverter,
  getRelatedConverters,
} from "@/lib/converters";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Allow params access outside streaming shell (Next.js Instant nav). */
export const instant = false;

export function generateStaticParams() {
  return converters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const converter = getConverter(slug);
  if (!converter) return { title: "Converter" };
  return {
    title: converter.title,
    description: converter.description,
  };
}

export default async function ConverterPage({ params }: Props) {
  const { slug } = await params;
  const converter = getConverter(slug);
  if (!converter) notFound();

  const related = getRelatedConverters(slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Converters", href: "/convert" },
          { label: converter.title },
        ]}
      />
      <Suspense
        fallback={
          <div className="rounded-[16px] border border-[var(--gray-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            Loading…
          </div>
        }
      >
        <ConverterForm slug={converter.slug} />
      </Suspense>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading mb-4 text-lg font-bold">Related converters</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((c) => (
              <ToolCard
                key={c.slug}
                href={`/convert/${c.slug}`}
                title={c.title}
                description={c.description}
                family="convert"
                icon={c.fromUnit.slice(0, 3).toUpperCase()}
              />
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-sm text-[var(--gray-muted)]">
        Working with documents? Try{" "}
        <Link
          href="/tools/pdf"
          className="font-semibold text-[var(--brand)] hover:underline"
        >
          PDF tools
        </Link>{" "}
        — merge, split, sign, and fill forms.
      </p>
    </main>
  );
}
