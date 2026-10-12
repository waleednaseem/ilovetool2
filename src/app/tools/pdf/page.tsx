import type { Metadata } from "next";
import PdfToolsBrowser from "@/components/pdf/PdfToolsBrowser";

export const metadata: Metadata = {
  title: "PDF Tools",
  description:
    "All PDF tools: merge, split, convert, sign, watermark, and more — iLovePDF-style suite.",
};

export default function PdfToolsIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Every PDF tool you need
        </h1>
        <p className="mt-2 text-[var(--gray-muted)]">
          Client tools run in your browser. Tools marked Soon use the API when ready.
        </p>
      </div>
      <PdfToolsBrowser />
    </main>
  );
}
