import ToolsIndex from "@/components/tools/ToolsIndex";
import { imageTools } from "@/lib/image/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Tools",
  description: "Compress, resize, crop, rotate, and convert images in your browser.",
};

export default function ImageToolsPage() {
  return (
    <ToolsIndex
      title="Image tools"
      description="Compress, resize, crop, rotate, and convert JPG, PNG, WEBP, and BMP."
      family="image"
      tools={imageTools.map((t) => ({
        ...t,
        href: `/tools/image/${t.slug}`,
      }))}
    />
  );
}
