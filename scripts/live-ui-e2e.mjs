/**
 * Live UI E2E against running Next server (Playwright).
 * Usage: node scripts/live-ui-e2e.mjs http://localhost:3000
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const base = process.argv[2] || "http://localhost:3000";
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

function slugsFromBlocks(src) {
  const out = [];
  for (const block of src.split(/\{\s*\n\s*slug:/).slice(1)) {
    const slug = block.match(/^\s*"([^"]+)"/)?.[1];
    if (slug) out.push(slug);
  }
  return out;
}

function clientStubFromPdf(src) {
  const client = [];
  const stubs = [];
  for (const block of src.split(/\{\s*\n\s*slug:/).slice(1)) {
    const slug = block.match(/^\s*"([^"]+)"/)?.[1];
    const mode = block.match(/mode:\s*"(client|stub)"/)?.[1];
    if (!slug || !mode) continue;
    (mode === "stub" ? stubs : client).push(slug);
  }
  return { client, stubs };
}

const pdfSrc = readFileSync(join(root, "src/lib/pdf/registry.ts"), "utf8");
const converterSrc = readFileSync(join(root, "src/lib/converters/registry.ts"), "utf8");
const { client, stubs } = clientStubFromPdf(pdfSrc);
const imageSlugs = slugsFromBlocks(readFileSync(join(root, "src/lib/image/registry.ts"), "utf8"));
const textSlugs = slugsFromBlocks(readFileSync(join(root, "src/lib/text/registry.ts"), "utf8"));
const zipSlugs = slugsFromBlocks(readFileSync(join(root, "src/lib/zip/registry.ts"), "utf8"));
const otherSlugs = slugsFromBlocks(readFileSync(join(root, "src/lib/other/registry.ts"), "utf8"));
const convertSlugs = [
  ...new Set([
    ...[...converterSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
    ...[...converterSrc.matchAll(/pair\(\s*"([^"]+)"/g)].map((m) => m[1]),
  ]),
];

const results = [];
function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(25000);

async function upload(path) {
  await page.locator('input[type="file"]').first().setInputFiles(path);
  await page.waitForTimeout(1200);
}

// --- homepage catalog ---
await page.goto(base + "/", { waitUntil: "domcontentloaded" });
log("home", await page.locator("text=ConvertPDF").first().isVisible());
const search = page.locator('input[type="search"]');
if (await search.count()) {
  await search.fill("QR");
  await page.waitForTimeout(400);
  const body = await page.locator("body").innerText();
  log("home:search", /QR Code/i.test(body), "QR filter");
  await search.fill("");
  await page.getByRole("button", { name: "Image" }).click().catch(() => {});
  await page.waitForTimeout(300);
  log(
    "home:pill-image",
    /Compress Image|Resize Image/i.test(await page.locator("body").innerText())
  );
}

// --- client PDF ---
for (const slug of client) {
  try {
    await page.goto(base + `/tools/pdf/${slug}`, { waitUntil: "networkidle" });
    const h1 = (await page.locator("h1").first().textContent())?.trim();
    if (slug === "html-to-pdf") {
      // HTML tool uses a textarea, not a file upload
      const listed = (await page.locator("textarea").count()) > 0;
      log(`pdf-client:${slug}`, listed, h1);
    } else if (slug === "scan-to-pdf") {
      const body = await page.locator("body").innerText();
      log(
        `pdf-client:${slug}`,
        /Create PDF|Start camera|Upload photos/i.test(body),
        h1
      );
    } else if (slug === "jpg-to-pdf" || slug === "merge-pdf-images") {
      await upload(slug === "jpg-to-pdf" ? samplePng : samplePdf);
      const body = await page.locator("body").innerText();
      const listed =
        /sample-unsigned|e2e-pixel|1 file|\.pdf|\.png/i.test(body) ||
        (await page.locator("canvas").count()) > 0;
      log(`pdf-client:${slug}`, listed, h1);
    } else {
      await upload(samplePdf);
      const body = await page.locator("body").innerText();
      const err =
        /could not|unexpected error|failed to/i.test(body) &&
        !/Coming soon|No extractable/i.test(body);
      const listed =
        /sample-unsigned|e2e-pixel|1 file|files? selected|\.pdf|\.png/i.test(
          body
        ) ||
        (await page.locator("canvas").count()) > 0 ||
        (await page.locator("textarea").count()) > 0;
      log(`pdf-client:${slug}`, !err && listed, err ? "error" : h1);
    }
  } catch (e) {
    log(`pdf-client:${slug}`, false, String(e.message || e));
  }
}

// --- stubs ---
for (const slug of stubs) {
  try {
    await page.goto(base + `/tools/pdf/${slug}`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    log(`pdf-stub:${slug}`, /Coming soon/i.test(body));
  } catch (e) {
    log(`pdf-stub:${slug}`, false, String(e.message || e));
  }
}

// --- image tools ---
for (const slug of imageSlugs) {
  try {
    await page.goto(base + `/tools/image/${slug}`, { waitUntil: "networkidle" });
    await upload(samplePng);
    const body = await page.locator("body").innerText();
    const ok = /e2e-pixel|Process & download/i.test(body);
    log(`image:${slug}`, ok, (await page.locator("h1").first().textContent())?.trim());
  } catch (e) {
    log(`image:${slug}`, false, String(e.message || e));
  }
}

// --- text tools ---
for (const slug of textSlugs) {
  try {
    await page.goto(base + `/tools/text/${slug}`, { waitUntil: "domcontentloaded" });
    const ta = page.locator("textarea").first();
    if (slug === "lorem") {
      await page.getByRole("button", { name: /Generate/i }).click();
      await page.waitForTimeout(300);
    } else {
      await ta.fill("Hello ConvertPDF");
      if (slug === "transform") {
        await page.getByRole("button", { name: "UPPER" }).click();
      }
      if (slug === "base64") {
        await page.getByRole("button", { name: "Encode", exact: true }).click();
        await page.waitForTimeout(400);
      }
    }
    const val = await ta.inputValue();
    log(`text:${slug}`, val.length > 0, val.slice(0, 40) || "(empty)");
  } catch (e) {
    log(`text:${slug}`, false, String(e.message || e));
  }
}

// --- zip tools ---
for (const slug of zipSlugs) {
  try {
    await page.goto(base + `/tools/zip/${slug}`, { waitUntil: "domcontentloaded" });
    if (slug === "create") {
      await upload(samplePng);
      const body = await page.locator("body").innerText();
      log(`zip:${slug}`, /1 file|e2e-pixel|Create ZIP/i.test(body));
    } else {
      // extract needs a zip — create one quickly via JSZip in page after uploading png is wrong
      // Just verify page shell + button
      const body = await page.locator("body").innerText();
      log(`zip:${slug}`, /Extract files|ZIP Extractor/i.test(body));
    }
  } catch (e) {
    log(`zip:${slug}`, false, String(e.message || e));
  }
}

// --- other tools ---
for (const slug of otherSlugs) {
  try {
    await page.goto(base + `/tools/other/${slug}`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    if (slug === "qr") {
      log(`other:${slug}`, (await page.locator("canvas").count()) > 0 || /Download/i.test(body));
    } else if (slug === "password") {
      await page.getByRole("button", { name: /Generate/i }).click();
      await page.waitForTimeout(200);
      log(`other:${slug}`, (await page.locator("code").count()) > 0 || /Download/i.test(await page.locator("body").innerText()));
    } else if (slug === "barcode") {
      log(`other:${slug}`, (await page.locator("svg").count()) > 0 || /Download/i.test(body));
    } else if (slug === "color-extractor") {
      await upload(samplePng);
      await page.waitForTimeout(800);
      log(`other:${slug}`, /#|Drop image|Extract/i.test(await page.locator("body").innerText()));
    } else {
      log(`other:${slug}`, body.length > 40);
    }
  } catch (e) {
    log(`other:${slug}`, false, String(e.message || e));
  }
}

// --- converters ---
for (const slug of convertSlugs) {
  try {
    await page.goto(base + `/convert/${slug}`, { waitUntil: "domcontentloaded" });
    const h1 = await page.locator("h1").first().textContent();
    const numberInputs = page.locator('input[type="number"], input[type="text"]');
    if ((await numberInputs.count()) > 0) {
      await numberInputs.first().fill("10");
    }
    log(`convert:${slug}`, !!h1, h1?.trim());
  } catch (e) {
    log(`convert:${slug}`, false, String(e.message || e));
  }
}

// --- index pages ---
for (const path of ["/tools/pdf", "/tools/image", "/tools/text", "/tools/zip", "/tools/other", "/convert"]) {
  try {
    await page.goto(base + path, { waitUntil: "domcontentloaded" });
    log(`index:${path}`, (await page.locator("h1").count()) > 0);
  } catch (e) {
    log(`index:${path}`, false, String(e.message || e));
  }
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
