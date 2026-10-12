import { PDFDocument, StandardFonts } from "pdf-lib";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "tmp");
mkdirSync(outDir, { recursive: true });

async function addSignatureToPdf(pdfBytes, options) {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const page = doc.getPage(options.pageNumber - 1);
  const image =
    options.imageType === "png"
      ? await doc.embedPng(options.imageBytes)
      : await doc.embedJpg(options.imageBytes);
  page.drawImage(image, {
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
  });
  return doc.save();
}

const doc = await PDFDocument.create();
const font = await doc.embedFont(StandardFonts.Helvetica);
const page = doc.addPage([595, 842]);
page.drawText("Contract Sample", { x: 50, y: 780, size: 24, font });
page.drawText("Please sign below.", { x: 50, y: 740, size: 14, font });
page.drawText("Name: ______________________", { x: 50, y: 200, size: 12, font });
const original = await doc.save();
writeFileSync(join(outDir, "sample-unsigned.pdf"), original);

const png = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6aAAAAAElFTkSuQmCC",
    "base64"
  )
);

const signed = await addSignatureToPdf(original, {
  pageNumber: 1,
  imageBytes: png,
  imageType: "png",
  x: 50,
  y: 100,
  width: 160,
  height: 50,
});
writeFileSync(join(outDir, "sample-signed.pdf"), signed);

const verify = await PDFDocument.load(signed);
const pages = verify.getPageCount();
const grew = signed.byteLength > original.byteLength;
const ok = pages === 1 && grew;

console.log(
  JSON.stringify(
    {
      ok,
      pages,
      unsignedBytes: original.byteLength,
      signedBytes: signed.byteLength,
      unsigned: "tmp/sample-unsigned.pdf",
      signed: "tmp/sample-signed.pdf",
    },
    null,
    2
  )
);

if (!ok) process.exit(1);
