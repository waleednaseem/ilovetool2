import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "Waleed-Production-ConvertPDF-Services.pdf");

const BRAND = {
  navy: rgb(0.08, 0.16, 0.28),
  blue: rgb(0.12, 0.35, 0.55),
  accent: rgb(0.85, 0.45, 0.12),
  muted: rgb(0.4, 0.45, 0.5),
  light: rgb(0.95, 0.96, 0.97),
  white: rgb(1, 1, 1),
  line: rgb(0.82, 0.85, 0.88),
  text: rgb(0.15, 0.18, 0.22),
};

const sections = [
  {
    title: "1. PDF Tools",
    subtitle: "37 tools — organize, convert, edit, secure, and AI-assisted workflows",
    groups: [
      {
        name: "Organize",
        items: [
          "Merge PDF",
          "Merge PDF & Images",
          "Split PDF",
          "Compress PDF",
          "Organize PDF (reorder / delete pages)",
          "Rotate PDF",
          "Repair PDF",
          "Crop PDF",
          "Compare PDF",
        ],
      },
      {
        name: "Convert",
        items: [
          "PDF to Word",
          "PDF to PowerPoint",
          "PDF to Excel",
          "Word to PDF",
          "PowerPoint to PDF",
          "Excel to PDF",
          "PDF to JPG",
          "JPG to PDF",
          "Extract Images",
          "Extract Text",
          "HTML to PDF",
          "PDF to PDF/A",
          "PDF to Markdown",
        ],
      },
      {
        name: "Edit",
        items: [
          "Edit PDF",
          "Add Text",
          "Sign PDF",
          "Request e-Sign",
          "Watermark",
          "Page Numbers",
          "Redact PDF",
          "Fill Form",
          "Create Form",
          "OCR PDF",
        ],
      },
      {
        name: "Security",
        items: ["Unlock PDF", "Protect PDF"],
      },
      {
        name: "AI Tools",
        items: ["AI Summarizer", "Translate PDF", "Scan to PDF"],
      },
    ],
  },
  {
    title: "2. Image Tools",
    subtitle: "8 tools — compress, resize, crop, rotate, and format conversion",
    groups: [
      {
        name: "Tools",
        items: [
          "Compress Image",
          "Resize Image",
          "Crop Image",
          "Rotate Image",
          "Convert to JPG",
          "Convert to PNG",
          "Convert to WEBP",
          "Convert to BMP",
        ],
      },
    ],
  },
  {
    title: "3. Text Tools",
    subtitle: "3 tools — quick text utilities in the browser",
    groups: [
      {
        name: "Tools",
        items: ["Text Transform", "Base64 Encoder / Decoder", "Lorem Ipsum Generator"],
      },
    ],
  },
  {
    title: "4. ZIP Tools",
    subtitle: "2 tools — create and extract archives",
    groups: [
      {
        name: "Tools",
        items: ["ZIP Creator", "ZIP Extractor"],
      },
    ],
  },
  {
    title: "5. Other Tools",
    subtitle: "4 utilities for everyday productivity",
    groups: [
      {
        name: "Tools",
        items: [
          "QR Code Generator",
          "Password Generator",
          "Color Extractor",
          "Barcode Generator",
        ],
      },
    ],
  },
  {
    title: "6. Unit Converters",
    subtitle: "14 converters — length, area, fabric, currency, weight, temperature",
    groups: [
      {
        name: "Length",
        items: ["Kilometers to Miles", "Meters to Feet", "Centimeters to Inches"],
      },
      {
        name: "Area",
        items: ["Square Meters to Square Feet", "Acres to Hectares"],
      },
      {
        name: "Fabric",
        items: ["Meters to Yards", "Fabric cm to Inches", "Cloth Meters to Feet"],
      },
      {
        name: "Currency",
        items: ["USD to PKR", "EUR to PKR", "GBP to PKR", "Multi Currency Converter"],
      },
      {
        name: "Weight & Temperature",
        items: ["Kilograms to Pounds", "Celsius to Fahrenheit"],
      },
    ],
  },
];

function drawFooter(page, font, pageNum, total) {
  const { width } = page.getSize();
  page.drawLine({
    start: { x: 48, y: 36 },
    end: { x: width - 48, y: 36 },
    thickness: 0.5,
    color: BRAND.line,
  });
  page.drawText("Waleed Production  ·  ConvertPDF Services Overview", {
    x: 48,
    y: 22,
    size: 8,
    font,
    color: BRAND.muted,
  });
  page.drawText(`Page ${pageNum} of ${total}`, {
    x: width - 48 - 55,
    y: 22,
    size: 8,
    font,
    color: BRAND.muted,
  });
}

async function main() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // —— Cover ——
  {
    const page = doc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: BRAND.navy,
    });
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 12,
      height,
      color: BRAND.accent,
    });

    page.drawText("WALEED PRODUCTION", {
      x: 56,
      y: height - 160,
      size: 28,
      font: fontBold,
      color: BRAND.white,
    });

    page.drawText("ConvertPDF", {
      x: 56,
      y: height - 220,
      size: 42,
      font: fontBold,
      color: BRAND.accent,
    });

    page.drawText("Platform Services & Tools Overview", {
      x: 56,
      y: height - 258,
      size: 16,
      font,
      color: rgb(0.75, 0.8, 0.85),
    });

    page.drawLine({
      start: { x: 56, y: height - 280 },
      end: { x: 280, y: height - 280 },
      thickness: 2,
      color: BRAND.accent,
    });

    const stats = [
      ["68+", "Total Tools"],
      ["6", "Categories"],
      ["Browser", "Client-side focus"],
    ];
    stats.forEach(([value, label], i) => {
      const y = height - 360 - i * 52;
      page.drawText(value, {
        x: 56,
        y,
        size: 20,
        font: fontBold,
        color: BRAND.white,
      });
      page.drawText(label, {
        x: 56,
        y: y - 18,
        size: 11,
        font,
        color: rgb(0.65, 0.72, 0.78),
      });
    });

    page.drawText("Prepared for client presentation", {
      x: 56,
      y: 80,
      size: 10,
      font,
      color: rgb(0.55, 0.62, 0.68),
    });
    page.drawText(new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }), {
      x: 56,
      y: 62,
      size: 10,
      font,
      color: rgb(0.55, 0.62, 0.68),
    });
  }

  // —— Summary ——
  {
    const page = doc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 0,
      y: height - 72,
      width,
      height: 72,
      color: BRAND.navy,
    });
    page.drawText("Waleed Production", {
      x: 48,
      y: height - 32,
      size: 10,
      font,
      color: rgb(0.7, 0.78, 0.85),
    });
    page.drawText("Executive Summary", {
      x: 48,
      y: height - 54,
      size: 18,
      font: fontBold,
      color: BRAND.white,
    });

    const paras = [
      "ConvertPDF is a web platform by Waleed Production that combines PDF productivity tools with image, text, ZIP, utility, and unit-conversion services.",
      "Most tools run in the user's browser for speed and privacy. The catalog is organized into six clear categories for easy discovery and SEO.",
      "This document lists every tool currently available on the platform for client review and alignment.",
    ];

    let y = height - 120;
    for (const p of paras) {
      const words = p.split(" ");
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(test, 11) > width - 96) {
          page.drawText(line, { x: 48, y, size: 11, font, color: BRAND.text });
          y -= 16;
          line = w;
        } else {
          line = test;
        }
      }
      if (line) {
        page.drawText(line, { x: 48, y, size: 11, font, color: BRAND.text });
        y -= 28;
      }
    }

    y -= 8;
    page.drawText("Category Snapshot", {
      x: 48,
      y,
      size: 13,
      font: fontBold,
      color: BRAND.navy,
    });
    y -= 24;

    const snapshot = [
      ["PDF Tools", "37"],
      ["Image Tools", "8"],
      ["Text Tools", "3"],
      ["ZIP Tools", "2"],
      ["Other Tools", "4"],
      ["Unit Converters", "14"],
    ];

    snapshot.forEach(([name, count], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 48 + col * 250;
      const boxY = y - row * 56;
      page.drawRectangle({
        x,
        y: boxY - 36,
        width: 230,
        height: 44,
        color: BRAND.light,
      });
      page.drawRectangle({
        x,
        y: boxY - 36,
        width: 4,
        height: 44,
        color: BRAND.accent,
      });
      page.drawText(count, {
        x: x + 16,
        y: boxY - 14,
        size: 16,
        font: fontBold,
        color: BRAND.blue,
      });
      page.drawText(name, {
        x: x + 16,
        y: boxY - 30,
        size: 10,
        font,
        color: BRAND.muted,
      });
    });

    drawFooter(page, font, 2, 0); // placeholder; fix later
  }

  // —— Detail pages ——
  let page = doc.addPage([595.28, 841.89]);
  let { width, height } = page.getSize();
  let y = height - 56;
  let pageIndex = 3;

  const ensureSpace = (needed) => {
    if (y - needed < 56) {
      drawFooter(page, font, pageIndex, 0);
      page = doc.addPage([595.28, 841.89]);
      ({ width, height } = page.getSize());
      y = height - 56;
      pageIndex += 1;
    }
  };

  const drawSectionHeader = (title, subtitle) => {
    ensureSpace(70);
    page.drawRectangle({
      x: 48,
      y: y - 42,
      width: width - 96,
      height: 48,
      color: BRAND.navy,
    });
    page.drawText(title, {
      x: 60,
      y: y - 18,
      size: 14,
      font: fontBold,
      color: BRAND.white,
    });
    page.drawText(subtitle, {
      x: 60,
      y: y - 34,
      size: 9,
      font,
      color: rgb(0.7, 0.78, 0.85),
    });
    y -= 64;
  };

  for (const section of sections) {
    drawSectionHeader(section.title, section.subtitle);

    for (const group of section.groups) {
      ensureSpace(40);
      page.drawText(group.name.toUpperCase(), {
        x: 48,
        y,
        size: 9,
        font: fontBold,
        color: BRAND.accent,
      });
      y -= 16;

      const colWidth = (width - 96 - 16) / 2;
      let col = 0;
      let rowY = y;

      for (const item of group.items) {
        ensureSpace(18);
        if (y < 70) {
          drawFooter(page, font, pageIndex, 0);
          page = doc.addPage([595.28, 841.89]);
          ({ width, height } = page.getSize());
          y = height - 56;
          pageIndex += 1;
          rowY = y;
          col = 0;
        }

        const x = 48 + col * (colWidth + 16);
        page.drawCircle({
          x: x + 3,
          y: rowY + 3,
          size: 2,
          color: BRAND.blue,
        });
        page.drawText(item, {
          x: x + 12,
          y: rowY,
          size: 10,
          font,
          color: BRAND.text,
        });

        col += 1;
        if (col > 1) {
          col = 0;
          rowY -= 16;
          y = rowY;
        }
      }
      if (col !== 0) {
        y = rowY - 16;
      } else {
        y = rowY - 8;
      }
      y -= 10;
    }
    y -= 8;
  }

  // Closing note
  ensureSpace(90);
  page.drawRectangle({
    x: 48,
    y: y - 70,
    width: width - 96,
    height: 70,
    color: BRAND.light,
  });
  page.drawText("Notes", {
    x: 60,
    y: y - 20,
    size: 11,
    font: fontBold,
    color: BRAND.navy,
  });
  page.drawText("• Majority of tools process files in the browser (privacy-friendly).", {
    x: 60,
    y: y - 38,
    size: 9,
    font,
    color: BRAND.text,
  });
  page.drawText("• Catalog is ready for product demos, SEO landing pages, and client walkthroughs.", {
    x: 60,
    y: y - 52,
    size: 9,
    font,
    color: BRAND.text,
  });

  drawFooter(page, font, pageIndex, 0);

  // Fix page numbers with correct totals
  const pages = doc.getPages();
  const total = pages.length;
  // Cover has no footer; pages 2..n need correct totals
  // Re-draw footers is hard; instead draw page numbers only on non-cover pages cleanly
  // We already drew some footers with total 0 — overwrite by drawing white rect + new footer text
  for (let i = 1; i < pages.length; i++) {
    const p = pages[i];
    const { width: w } = p.getSize();
    p.drawRectangle({
      x: w - 48 - 70,
      y: 16,
      width: 70,
      height: 14,
      color: BRAND.white,
    });
    p.drawText(`Page ${i + 1} of ${total}`, {
      x: w - 48 - 55,
      y: 22,
      size: 8,
      font,
      color: BRAND.muted,
    });
  }

  const bytes = await doc.save();
  mkdirSync(__dirname, { recursive: true });
  writeFileSync(outPath, bytes);
  console.log(`Created: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
