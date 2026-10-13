/**
 * Functional E2E: actually process key tools and assert downloads / UI outcomes.
 * Usage: node scripts/functional-e2e.mjs http://localhost:3001
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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

if (!existsSync(samplePdf)) {
  console.error("Missing public/sample-unsigned.pdf");
  process.exit(1);
}

const results = [];
function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(45000);

async function downloadAfter(action) {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 60000 }),
    action(),
  ]);
  const path = await download.path();
  const name = download.suggestedFilename();
  const size = path ? readFileSync(path).length : 0;
  return { name, size };
}

async function gotoTool(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
}

async function uploadFirst(filePath) {
  const input = page.locator('input[type="file"]').first();
  await input.waitFor({ state: "attached", timeout: 15000 });
  await input.setInputFiles(filePath);
  await page.waitForTimeout(800);
}

// --- smoke home ---
await gotoTool("/");
log("home", /ConvertPDF/i.test(await page.locator("body").innerText()));

// --- Protect (real encrypt) ---
try {
  await gotoTool("/tools/pdf/protect");
  const body0 = await page.locator("body").innerText();
  const badButtons =
    /Unlock & download|Queue protect/i.test(body0);
  log("protect:buttons", !badButtons && /Protect & download/i.test(body0));
  await uploadFirst(samplePdf);
  await page.locator('input[type="password"]').nth(0).fill("Test@123");
  await page.locator('input[type="password"]').nth(1).fill("Test@123");
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Protect & download/i }).click()
  );
  log("protect:download", dl.size > 500, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("protect:download", false, String(e.message || e));
}

// --- Unlock ---
try {
  await gotoTool("/tools/pdf/unlock");
  await uploadFirst(samplePdf);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Unlock & download/i }).click()
  );
  log("unlock:download", dl.size > 200, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("unlock:download", false, String(e.message || e));
}

// --- Compress ---
try {
  await gotoTool("/tools/pdf/compress");
  await uploadFirst(samplePdf);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Compress & download/i }).click()
  );
  log("compress:download", dl.size > 200, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("compress:download", false, String(e.message || e));
}

// --- Merge (needs 2+ files) ---
try {
  await gotoTool("/tools/pdf/merge");
  const input = page.locator('input[type="file"]').first();
  await input.waitFor({ state: "attached" });
  await input.setInputFiles([samplePdf, samplePdf]);
  await page.waitForTimeout(800);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Merge & download/i }).click()
  );
  log("merge:download", dl.size > 200, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("merge:download", false, String(e.message || e));
}

// --- Extract text ---
try {
  await gotoTool("/tools/pdf/extract-text");
  await uploadFirst(samplePdf);
  await page.getByRole("button", { name: /Extract|Download/i }).first().click();
  await page.waitForTimeout(2000);
  const body = await page.locator("body").innerText();
  log(
    "extract-text",
    body.length > 80 && !/Coming soon/i.test(body),
    body.slice(0, 60).replace(/\s+/g, " ")
  );
} catch (e) {
  log("extract-text", false, String(e.message || e));
}

// --- PDF to Word ---
try {
  await gotoTool("/tools/pdf/pdf-to-word");
  await uploadFirst(samplePdf);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Convert & download/i }).click()
  );
  log("pdf-to-word", dl.size > 500 && /\.docx$/i.test(dl.name), `${dl.name} ${dl.size}b`);
} catch (e) {
  log("pdf-to-word", false, String(e.message || e));
}

// --- HTML to PDF ---
try {
  await gotoTool("/tools/pdf/html-to-pdf");
  await page.locator("textarea").fill("<h1>E2E</h1><p>Hello</p>");
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Convert & download/i }).click()
  );
  log("html-to-pdf", dl.size > 200, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("html-to-pdf", false, String(e.message || e));
}

// --- Redact ---
try {
  await gotoTool("/tools/pdf/redact");
  await uploadFirst(samplePdf);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Redact & download/i }).click()
  );
  log("redact", dl.size > 200, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("redact", false, String(e.message || e));
}

// --- Repair ---
try {
  await gotoTool("/tools/pdf/repair");
  await uploadFirst(samplePdf);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Repair & download/i }).click()
  );
  log("repair", dl.size > 200, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("repair", false, String(e.message || e));
}

// --- Crop Image visual ---
try {
  await gotoTool("/tools/image/crop");
  await uploadFirst(samplePng);
  await page.waitForTimeout(1000);
  const img = page.locator('img[alt="Crop preview"]');
  const hasPreview = (await img.count()) > 0;
  log("crop-image:preview", hasPreview);
  if (hasPreview) {
    const dl = await downloadAfter(() =>
      page.getByRole("button", { name: /Process & download/i }).click()
    );
    log("crop-image:download", dl.size > 50, `${dl.name} ${dl.size}b`);
  } else {
    log("crop-image:download", false, "no preview");
  }
} catch (e) {
  log("crop-image", false, String(e.message || e));
}

// --- Image compress ---
try {
  await gotoTool("/tools/image/compress");
  await uploadFirst(samplePng);
  const dl = await downloadAfter(() =>
    page.getByRole("button", { name: /Process & download/i }).click()
  );
  log("image-compress", dl.size > 20, `${dl.name} ${dl.size}b`);
} catch (e) {
  log("image-compress", false, String(e.message || e));
}

// --- Scan page (no Coming soon) ---
try {
  await gotoTool("/tools/pdf/scan-to-pdf");
  const body = await page.locator("body").innerText();
  log(
    "scan-to-pdf:ui",
    /Create PDF|Start camera|Upload photos/i.test(body) &&
      !/Coming soon/i.test(body)
  );
} catch (e) {
  log("scan-to-pdf:ui", false, String(e.message || e));
}

// --- No stub badges on PDF index ---
try {
  await gotoTool("/tools/pdf");
  const body = await page.locator("body").innerText();
  const soonCount = (body.match(/\bSoon\b/g) || []).length;
  log("pdf-index:no-soon", soonCount === 0, `Soon badges=${soonCount}`);
} catch (e) {
  log("pdf-index:no-soon", false, String(e.message || e));
}

// --- All PDF tool pages load H1 + no Coming soon ---
const pdfSrc = readFileSync(join(root, "src/lib/pdf/registry.ts"), "utf8");
const slugs = [...pdfSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
for (const slug of slugs) {
  try {
    await gotoTool(`/tools/pdf/${slug}`);
    const body = await page.locator("body").innerText();
    const h1 = (await page.locator("h1").first().textContent())?.trim();
    const stubby = /Coming soon|Queue job in database/i.test(body);
    log(`page:${slug}`, !!h1 && !stubby, h1 || "no h1");
  } catch (e) {
    log(`page:${slug}`, false, String(e.message || e));
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
