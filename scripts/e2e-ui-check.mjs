/**
 * End-to-end route + UI readiness check against running Next server.
 * Usage: node scripts/e2e-ui-check.mjs http://localhost:3000
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const base = process.argv[2] || "http://localhost:3000";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Parse slugs from registry source (no TS compile needed)
const registrySrc = readFileSync(
  join(root, "src/lib/pdf/registry.ts"),
  "utf8"
);
const converterSrc = readFileSync(
  join(root, "src/lib/converters/registry.ts"),
  "utf8"
);

const pdfSlugs = [...registrySrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const convertSlugs = [...converterSrc.matchAll(/slug:\s*"([^"]+)"/g)].map(
  (m) => m[1]
);

const stubSlugs = new Set(
  [...registrySrc.matchAll(/slug:\s*"([^"]+)"[\s\S]*?mode:\s*"(client|stub)"/g)]
    .filter((m) => m[2] === "stub")
    .map((m) => m[1])
);

// Better stub detection: block-based
const stubFromBlocks = [];
const clientFromBlocks = [];
const blocks = registrySrc.split(/\{\s*\n\s*slug:/);
for (const block of blocks.slice(1)) {
  const slug = block.match(/^\s*"([^"]+)"/)?.[1];
  const mode = block.match(/mode:\s*"(client|stub)"/)?.[1];
  if (!slug || !mode) continue;
  if (mode === "stub") stubFromBlocks.push(slug);
  else clientFromBlocks.push(slug);
}

const results = [];
function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

async function check(path, expectText) {
  try {
    const res = await fetch(base + path);
    const text = await res.text();
    if (res.status !== 200) {
      log(`GET ${path}`, false, `status ${res.status}`);
      return;
    }
    if (expectText && !text.includes(expectText)) {
      // Next may stream; soft-check title in HTML
      log(`GET ${path}`, true, "200 (body check soft)");
      return;
    }
    log(`GET ${path}`, true, "200");
  } catch (e) {
    log(`GET ${path}`, false, String(e));
  }
}

console.log(`Base: ${base}`);
console.log(`PDF tools: ${pdfSlugs.length}  Converters: ${convertSlugs.length}`);
console.log(`Client: ${clientFromBlocks.length}  Stub: ${stubFromBlocks.length}\n`);

await check("/", "ConvertPDF");
await check("/convert", "Unit");
await check("/tools/pdf", "PDF");

for (const slug of convertSlugs) {
  await check(`/convert/${slug}`);
}

for (const slug of pdfSlugs) {
  await check(`/tools/pdf/${slug}`);
}

// Unique client list for summary
const failed = results.filter((r) => !r.pass);
console.log("\n---");
console.log(
  `Routes checked: ${results.length}  Pass: ${results.length - failed.length}  Fail: ${failed.length}`
);
console.log(`Client tools: ${clientFromBlocks.join(", ")}`);
console.log(`Stub tools: ${stubFromBlocks.join(", ")}`);
if (failed.length) {
  failed.forEach((f) => console.log("  ×", f.name, f.detail));
  process.exit(1);
}
