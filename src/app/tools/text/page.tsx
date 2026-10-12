import ToolsIndex from "@/components/tools/ToolsIndex";
import { textTools } from "@/lib/text/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Tools",
  description: "Transform text, Base64 encode/decode, and generate Lorem Ipsum.",
};

export default function TextToolsPage() {
  return (
    <ToolsIndex
      title="Text tools"
      description="Case transform, Base64, and placeholder text — all in your browser."
      family="text"
      tools={textTools.map((t) => ({
        ...t,
        href: `/tools/text/${t.slug}`,
      }))}
    />
  );
}
