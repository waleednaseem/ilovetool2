import PdfToolClient from "@/components/pdf/PdfToolClient";
import PdfToolShell from "@/components/tools/PdfToolShell";
import ToolCard from "@/components/tools/ToolCard";
import { getPdfTool, pdfTools } from "@/lib/pdf/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Allow params access outside streaming shell (Next.js Instant nav). */
export const instant = false;

export function generateStaticParams() {
  return pdfTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getPdfTool(slug);
  if (!tool) return { title: "PDF Tool" };
  return {
    title: tool.title,
    description: tool.description,
  };
}

export default async function PdfToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getPdfTool(slug);
  if (!tool) notFound();

  const others = pdfTools.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <PdfToolShell tool={tool}>
        <PdfToolClient tool={tool} />
      </PdfToolShell>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Other PDF tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <ToolCard
              key={t.slug}
              href={`/tools/pdf/${t.slug}`}
              title={t.title}
              description={t.description}
              badge={t.mode === "stub" ? "Soon" : undefined}
              family="pdf"
              icon="PDF"
            />
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-zinc-500">
        Also need quick math?{" "}
        <Link href="/convert" className="font-medium text-teal-800 hover:underline">
          Browse converters
        </Link>
        .
      </p>
    </main>
  );
}
