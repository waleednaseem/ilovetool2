import ToolsIndex from "@/components/tools/ToolsIndex";
import { otherTools } from "@/lib/other/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Other Tools",
  description: "QR codes, passwords, color palettes, and barcodes.",
};

export default function OtherToolsPage() {
  return (
    <ToolsIndex
      title="Other tools"
      description="QR codes, password generator, color extractor, and barcodes."
      family="other"
      tools={otherTools.map((t) => ({
        ...t,
        href: `/tools/other/${t.slug}`,
      }))}
    />
  );
}
