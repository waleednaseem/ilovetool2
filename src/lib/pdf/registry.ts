export type PdfToolMode = "client" | "stub";

export type PdfToolCategory =
  | "organize"
  | "convert"
  | "edit"
  | "security"
  | "ai";

export type PdfToolDef = {
  slug: string;
  title: string;
  description: string;
  mode: PdfToolMode;
  category: PdfToolCategory;
  featured?: boolean;
};

export const pdfCategories: { id: PdfToolCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "organize", label: "Organize PDF" },
  { id: "convert", label: "Convert PDF" },
  { id: "edit", label: "Edit PDF" },
  { id: "security", label: "Security" },
  { id: "ai", label: "AI tools" },
];

export const pdfTools: PdfToolDef[] = [
  // Organize
  {
    slug: "merge",
    title: "Merge PDF",
    description: "Combine PDFs in the order you want.",
    mode: "client",
    category: "organize",
    featured: true,
  },
  {
    slug: "merge-pdf-images",
    title: "Merge PDF & Images",
    description: "Combine PDFs and JPG/PNG images into one file.",
    mode: "client",
    category: "organize",
    featured: true,
  },
  {
    slug: "split",
    title: "Split PDF",
    description: "Separate pages into independent PDF files.",
    mode: "client",
    category: "organize",
    featured: true,
  },
  {
    slug: "compress",
    title: "Compress PDF",
    description: "Reduce file size while keeping quality.",
    mode: "stub",
    category: "organize",
  },
  {
    slug: "organize",
    title: "Organize PDF",
    description: "Reorder or delete pages.",
    mode: "client",
    category: "organize",
  },
  {
    slug: "rotate",
    title: "Rotate PDF",
    description: "Rotate pages the way you need.",
    mode: "client",
    category: "organize",
  },
  {
    slug: "repair",
    title: "Repair PDF",
    description: "Repair damaged PDFs. Coming soon via API.",
    mode: "stub",
    category: "organize",
  },
  {
    slug: "crop",
    title: "Crop PDF",
    description: "Crop margins or a selected area.",
    mode: "client",
    category: "organize",
  },
  {
    slug: "compare",
    title: "Compare PDF",
    description: "Side-by-side document comparison. Coming soon via API.",
    mode: "stub",
    category: "organize",
  },
  // Convert
  {
    slug: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF to DOC/DOCX. Coming soon via API.",
    mode: "stub",
    category: "convert",
    featured: true,
  },
  {
    slug: "pdf-to-powerpoint",
    title: "PDF to PowerPoint",
    description: "Convert PDF to PPT/PPTX. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Extract tables to Excel. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "word-to-pdf",
    title: "Word to PDF",
    description: "Convert DOC/DOCX to PDF. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "powerpoint-to-pdf",
    title: "PowerPoint to PDF",
    description: "Convert PPT/PPTX to PDF. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "excel-to-pdf",
    title: "Excel to PDF",
    description: "Convert spreadsheets to PDF. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert each PDF page into a JPG.",
    mode: "client",
    category: "convert",
    featured: true,
  },
  {
    slug: "extract-images",
    title: "Extract Images",
    description: "Extract embedded images (or export pages as PNG).",
    mode: "client",
    category: "convert",
  },
  {
    slug: "extract-text",
    title: "Extract Text",
    description: "Pull text content from your PDF documents.",
    mode: "client",
    category: "convert",
    featured: true,
  },
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG/PNG images to a PDF.",
    mode: "client",
    category: "convert",
    featured: true,
  },
  {
    slug: "html-to-pdf",
    title: "HTML to PDF",
    description: "Convert a webpage URL to PDF. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "pdf-to-pdfa",
    title: "PDF to PDF/A",
    description: "Archive-ready PDF/A. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  {
    slug: "pdf-to-markdown",
    title: "PDF to Markdown",
    description: "Turn PDFs into Markdown. Coming soon via API.",
    mode: "stub",
    category: "convert",
  },
  // Edit
  {
    slug: "edit",
    title: "Edit PDF",
    description: "Add text, images, drawings, and rectangles on your PDF.",
    mode: "client",
    category: "edit",
    featured: true,
  },
  {
    slug: "add-text",
    title: "Add Text",
    description: "Click on a page and add text.",
    mode: "client",
    category: "edit",
  },
  {
    slug: "sign",
    title: "Sign PDF",
    description: "Draw or upload a signature and place it on the page.",
    mode: "client",
    category: "edit",
    featured: true,
  },
  {
    slug: "esign-request",
    title: "Request e-Sign",
    description: "Add signers and signature boxes; download a request PDF to share.",
    mode: "client",
    category: "edit",
    featured: true,
  },
  {
    slug: "watermark",
    title: "Watermark",
    description: "Stamp text over your PDF pages.",
    mode: "client",
    category: "edit",
  },
  {
    slug: "page-numbers",
    title: "Page numbers",
    description: "Add page numbers to your PDF.",
    mode: "client",
    category: "edit",
  },
  {
    slug: "redact",
    title: "Redact PDF",
    description: "Permanently remove sensitive content. Coming soon via API.",
    mode: "stub",
    category: "edit",
  },
  {
    slug: "fill-form",
    title: "PDF Forms",
    description: "Fill AcroForm fields and download.",
    mode: "client",
    category: "edit",
    featured: true,
  },
  {
    slug: "create-form",
    title: "Create Form",
    description: "Add fillable text and checkbox fields to a PDF.",
    mode: "client",
    category: "edit",
  },
  {
    slug: "ocr",
    title: "OCR PDF",
    description: "Make scanned PDFs searchable. Coming soon via API.",
    mode: "stub",
    category: "edit",
  },
  // Security
  {
    slug: "unlock",
    title: "Unlock PDF",
    description: "Remove soft password locks when possible.",
    mode: "client",
    category: "security",
  },
  {
    slug: "protect",
    title: "Protect PDF",
    description: "Password encrypt PDFs. Unlock works now; encrypt via API soon.",
    mode: "client",
    category: "security",
  },
  // AI
  {
    slug: "summarizer",
    title: "AI Summarizer",
    description: "Summarize PDF content. Coming soon via API.",
    mode: "stub",
    category: "ai",
  },
  {
    slug: "translate",
    title: "Translate PDF",
    description: "AI translation keeping layout. Coming soon via API.",
    mode: "stub",
    category: "ai",
  },
  {
    slug: "scan-to-pdf",
    title: "Scan to PDF",
    description: "Capture scans to PDF. Coming soon via API.",
    mode: "stub",
    category: "ai",
  },
];

export function getPdfTool(slug: string): PdfToolDef | undefined {
  return pdfTools.find((t) => t.slug === slug);
}

export function getFeaturedPdfTools(): PdfToolDef[] {
  return pdfTools.filter((t) => t.featured);
}

export function getClientPdfTools(): PdfToolDef[] {
  return pdfTools.filter((t) => t.mode === "client");
}

export function getPdfToolsByCategory(
  category: PdfToolCategory | "all"
): PdfToolDef[] {
  if (category === "all") return pdfTools;
  return pdfTools.filter((t) => t.category === category);
}
