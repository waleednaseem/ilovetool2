import OtherToolClient from "@/components/other/OtherToolClient";
import ToolCard from "@/components/tools/ToolCard";
import ToolShell from "@/components/tools/ToolShell";
import { getOtherTool, otherTools } from "@/lib/other/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return otherTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getOtherTool(slug);
  if (!tool) return { title: "Tool" };
  return { title: tool.title, description: tool.description };
}

export default async function OtherToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getOtherTool(slug);
  if (!tool) notFound();
  const others = otherTools.filter((t) => t.slug !== slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <ToolShell title={tool.title} description={tool.description}>
        <OtherToolClient tool={tool} />
      </ToolShell>
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">More utilities</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <ToolCard
              key={t.slug}
              href={`/tools/other/${t.slug}`}
              title={t.title}
              description={t.description}
              family="other"
              icon="APP"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
