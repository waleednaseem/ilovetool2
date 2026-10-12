import ImageToolClient from "@/components/image/ImageToolClient";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import ToolShell from "@/components/tools/ToolShell";
import { getImageTool, imageTools } from "@/lib/image/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return imageTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getImageTool(slug);
  if (!tool) return { title: "Image Tool" };
  return { title: tool.title, description: tool.description };
}

export default async function ImageToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getImageTool(slug);
  if (!tool) notFound();
  const others = imageTools.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Image Tools", href: "/tools/image" },
          { label: tool.title },
        ]}
      />
      <ToolShell title={tool.title} description={tool.description}>
        <ImageToolClient tool={tool} />
      </ToolShell>
      <section className="mt-10">
        <h2 className="font-heading mb-4 text-lg font-bold">Other image tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <ToolCard
              key={t.slug}
              href={`/tools/image/${t.slug}`}
              title={t.title}
              description={t.description}
              family="image"
              icon="IMG"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
