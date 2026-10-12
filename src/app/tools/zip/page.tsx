import ToolsIndex from "@/components/tools/ToolsIndex";
import { zipTools } from "@/lib/zip/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZIP Tools",
  description: "Create and extract ZIP archives in your browser.",
};

export default function ZipToolsPage() {
  return (
    <ToolsIndex
      title="ZIP tools"
      description="Compress files into ZIP or extract archives locally."
      family="zip"
      tools={zipTools.map((t) => ({
        ...t,
        href: `/tools/zip/${t.slug}`,
      }))}
    />
  );
}
