import { PDFDocument, StandardFonts } from "pdf-lib";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "tmp", "smoke");
mkdirSync(outDir, { recursive: true });

const results = [];

function ok(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

async function makePdf(pages = 2) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i++) {
    const page = doc.addPage([400, 500]);
    page.drawText(`Smoke page ${i + 1}`, { x: 40, y: 400, size: 16, font });
  }
  return doc.save();
}

async function load(mod) {
  // Dynamic import of compiled logic via vitest isn't available; re-implement critical checks with pdf-lib
  return mod;
}

async function runLocalPdfSmoke() {
  const { PDFDocument: PD, degrees, rgb, StandardFonts: SF } = await import("pdf-lib");

  // Merge
  const a = await makePdf(2);
  const b = await makePdf(1);
  const merged = await PD.create();
  for (const bytes of [a, b]) {
    const d = await PD.load(bytes);
    const pages = await merged.copyPages(d, d.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const mergedBytes = await merged.save();
  ok("merge", (await PD.load(mergedBytes)).getPageCount() === 3, "3 pages");

  // Split extract
  const src = await PD.load(a);
  const split = await PD.create();
  const [p0] = await split.copyPages(src, [0]);
  split.addPage(p0);
  ok("split", (await split.save()).byteLength > 0);

  // Rotate
  const rotDoc = await PD.load(a);
  rotDoc.getPage(0).setRotation(degrees(90));
  ok("rotate", (await rotDoc.save()).byteLength > 0);

  // Watermark-like text
  const wm = await PD.load(a);
  const font = await wm.embedFont(SF.HelveticaBold);
  wm.getPage(0).drawText("WM", { x: 50, y: 200, size: 40, font, color: rgb(0.5, 0.5, 0.5), opacity: 0.3 });
  ok("watermark-text", (await wm.save()).byteLength > a.byteLength);

  // Page numbers
  const pn = await PD.load(a);
  const f2 = await pn.embedFont(SF.Helvetica);
  pn.getPages().forEach((page, i) => {
    page.drawText(String(i + 1), { x: 200, y: 20, size: 10, font: f2 });
  });
  ok("page-numbers", (await pn.save()).byteLength > 0);

  // Sign-like PNG embed
  const png = Uint8Array.from(
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    )
  );
  const signed = await PD.load(a);
  const img = await signed.embedPng(png);
  signed.getPage(0).drawImage(img, { x: 40, y: 40, width: 80, height: 30 });
  const signedBytes = await signed.save();
  writeFileSync(join(outDir, "signed.pdf"), signedBytes);
  ok("sign-embed", signedBytes.byteLength > a.byteLength);

  // JPG/PNG to PDF
  const imgDoc = await PD.create();
  const emb = await imgDoc.embedPng(png);
  const page = imgDoc.addPage([emb.width, emb.height]);
  page.drawImage(emb, { x: 0, y: 0, width: emb.width, height: emb.height });
  ok("jpg-to-pdf", (await imgDoc.save()).byteLength > 0);

  writeFileSync(join(outDir, "sample.pdf"), a);
}

async function runHttpSmoke(base) {
  const routes = [
    "/",
    "/convert",
    "/convert/km-to-mile",
    "/convert/usd-to-pkr",
    "/convert/multi-currency",
    "/tools/pdf",
    "/tools/pdf/merge",
    "/tools/pdf/split",
    "/tools/pdf/sign",
    "/tools/pdf/fill-form",
    "/tools/pdf/watermark",
    "/tools/pdf/page-numbers",
    "/tools/pdf/crop",
    "/tools/pdf/jpg-to-pdf",
    "/tools/pdf/pdf-to-jpg",
    "/tools/pdf/organize",
    "/tools/pdf/rotate",
    "/tools/pdf/unlock",
    "/tools/pdf/protect",
    "/tools/pdf/compress",
    "/tools/pdf/pdf-to-word",
    "/tools/pdf/ocr",
    "/robots.txt",
    "/sitemap.xml",
  ];

  for (const path of routes) {
    try {
      const res = await fetch(base + path);
      ok(`HTTP ${path}`, res.status === 200, `status ${res.status}`);
    } catch (e) {
      ok(`HTTP ${path}`, false, String(e));
    }
  }
}

const base = process.argv[2] || "http://localhost:3000";
await runLocalPdfSmoke();
await runHttpSmoke(base);

const failed = results.filter((r) => !r.pass);
console.log("\n---");
console.log(`Total: ${results.length}  Pass: ${results.length - failed.length}  Fail: ${failed.length}`);
if (failed.length) process.exit(1);
