import ToolCard from "@/components/tools/ToolCard";
import ToolShell from "@/components/tools/ToolShell";
import ZipToolClient from "@/components/zip/ZipToolClient";
import { getZipTool, zipTools } from "@/lib/zip/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return zipTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getZipTool(slug);
  if (!tool) return { title: "ZIP Tool" };
  return { title: tool.title, description: tool.description };
}

export default async function ZipToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getZipTool(slug);
  if (!tool) notFound();
  const others = zipTools.filter((t) => t.slug !== slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <ToolShell title={tool.title} description={tool.description}>
        <ZipToolClient tool={tool} />
      </ToolShell>
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Other ZIP tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <ToolCard
              key={t.slug}
              href={`/tools/zip/${t.slug}`}
              title={t.title}
              description={t.description}
              family="zip"
              icon="ZIP"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
