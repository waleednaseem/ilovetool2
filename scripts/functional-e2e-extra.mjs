/**
 * Extra functional downloads for remaining convert/edit tools.
 * Usage: node scripts/functional-e2e-extra.mjs http://localhost:3001
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from "xlsx";
import JSZip from "jszip";

const base = process.argv[2] || "http://localhost:3001";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const samplePdf = join(root, "public", "sample-unsigned.pdf");
const tmpDir = join(root, "tmp");
mkdirSync(tmpDir, { recursive: true });

const samplePng = join(tmpDir, "e2e-pixel.png");
writeFileSync(
  samplePng,
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC",
    "base64"
  )
);

const sampleDocx = join(tmpDir, "e2e.docx");
const sampleXlsx = join(tmpDir, "e2e.xlsx");
const samplePptx = join(tmpDir, "e2e.pptx");

const doc = new Document({
  sections: [
    {
      children: [new Paragraph({ children: [new TextRun("Hello from Word E2E")] })],
    },
  ],
});
writeFileSync(sampleDocx, await Packer.toBuffer(doc));

const book = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(
  book,
  XLSX.utils.aoa_to_sheet([
    ["A", "B"],
    [1, 2],
  ]),
  "Sheet1"
);
writeFileSync(sampleXlsx, XLSX.write(book, { type: "buffer", bookType: "xlsx" }));

// minimal pptx with one text slide
{
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>`
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`
  );
  const ppt = zip.folder("ppt");
  ppt.folder("_rels").file(
    "presentation.xml.rels",
    `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/></Relationships>`
  );
  ppt.file(
    "presentation.xml",
    `<?xml version="1.0"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst><p:sldSz cx="9144000" cy="6858000"/></p:presentation>`
  );
  ppt.folder("slides").file(
    "slide1.xml",
    `<?xml version="1.0"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t>Hello Slide</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>`
  );
  writeFileSync(samplePptx, await zip.generateAsync({ type: "nodebuffer" }));
}

const results = [];
function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(60000);

async function downloadAfter(action) {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 90000 }),
    action(),
  ]);
  const path = await download.path();
  return {
    name: download.suggestedFilename(),
    size: path ? readFileSync(path).length : 0,
  };
}

async function goto(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
}

async function upload(filePath) {
  const input = page.locator('input[type="file"]').first();
  await input.waitFor({ state: "attached" });
  await input.setInputFiles(filePath);
  const name = filePath.split(/[/\\]/).pop();
  await page.getByText(name, { exact: false }).first().waitFor({
    timeout: 10000,
  });
  await page.waitForTimeout(300);
}

const cases = [
  {
    name: "pdf-to-jpg",
    path: "/tools/pdf/pdf-to-jpg",
    file: samplePdf,
    btn: /Convert to JPG/i,
  },
  {
    name: "pdf-to-excel",
    path: "/tools/pdf/pdf-to-excel",
    file: samplePdf,
    btn: /Convert & download/i,
  },
  {
    name: "pdf-to-powerpoint",
    path: "/tools/pdf/pdf-to-powerpoint",
    file: samplePdf,
    btn: /Convert & download/i,
  },
  {
    name: "pdf-to-markdown",
    path: "/tools/pdf/pdf-to-markdown",
    file: samplePdf,
    btn: /Convert & download/i,
  },
  {
    name: "pdf-to-pdfa",
    path: "/tools/pdf/pdf-to-pdfa",
    file: samplePdf,
    btn: /Convert & download/i,
  },
  {
    name: "word-to-pdf",
    path: "/tools/pdf/word-to-pdf",
    file: sampleDocx,
    btn: /Convert & download/i,
  },
  {
    name: "excel-to-pdf",
    path: "/tools/pdf/excel-to-pdf",
    file: sampleXlsx,
    btn: /Convert & download/i,
  },
  {
    name: "powerpoint-to-pdf",
    path: "/tools/pdf/powerpoint-to-pdf",
    file: samplePptx,
    btn: /Convert & download/i,
  },
  {
    name: "jpg-to-pdf",
    path: "/tools/pdf/jpg-to-pdf",
    file: samplePng,
    btn: /Create|Convert|Download|Process/i,
  },
  {
    name: "rotate",
    path: "/tools/pdf/rotate",
    file: samplePdf,
    btn: /Rotate|Download/i,
  },
  {
    name: "watermark",
    path: "/tools/pdf/watermark",
    file: samplePdf,
    btn: /Apply|Download|Watermark/i,
  },
  {
    name: "page-numbers",
    path: "/tools/pdf/page-numbers",
    file: samplePdf,
    btn: /Add|Download|Apply/i,
  },
  {
    name: "crop-pdf",
    path: "/tools/pdf/crop",
    file: samplePdf,
    btn: /Crop & download/i,
  },
];

for (const c of cases) {
  try {
    if (!existsSync(c.file)) throw new Error("missing sample " + c.file);
    await goto(c.path);
    await upload(c.file);
    const dl = await downloadAfter(() =>
      page.getByRole("button", { name: c.btn }).first().click()
    );
    log(c.name, dl.size > 50, `${dl.name} ${dl.size}b`);
  } catch (e) {
    const red = await page.locator(".text-red-600").allTextContents().catch(() => []);
    log(c.name, false, `${e.message || e} | ${red.join(" ")}`);
  }
}

// compare (no download)
try {
  await goto("/tools/pdf/compare");
  const inputs = page.locator('input[type="file"]');
  await inputs.nth(0).setInputFiles(samplePdf);
  await inputs.nth(1).setInputFiles(samplePdf);
  await page.getByRole("button", { name: /Compare text/i }).click();
  await page.waitForTimeout(2000);
  const body = await page.locator("body").innerText();
  log("compare", /empty|sample|Convert|text/i.test(body) && !/Coming soon/i.test(body));
} catch (e) {
  log("compare", false, String(e.message || e));
}

// summarizer
try {
  await goto("/tools/pdf/summarizer");
  await upload(samplePdf);
  await page.getByRole("button", { name: /Summarize/i }).click();
  await page.waitForTimeout(3000);
  const red = await page.locator(".text-red-600").allTextContents();
  const pre = await page.locator("pre").allTextContents();
  log(
    "summarizer",
    red.length === 0 && pre.join("").length > 5,
    pre.join(" ").slice(0, 80)
  );
} catch (e) {
  log("summarizer", false, String(e.message || e));
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log("\n---");
console.log(
  `Total: ${results.length}  Pass: ${results.length - failed.length}  Fail: ${failed.length}`
);
if (failed.length) {
  failed.forEach((f) => console.log("  ×", f.name, f.detail));
  process.exit(1);
}
