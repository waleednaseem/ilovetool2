const base = process.argv[2] || "http://localhost:3000";

const client = [
  ["merge", "Merge & download"],
  ["split", "Extract ranges"],
  ["organize", "Apply order"],
  ["rotate", "Rotate & download"],
  ["crop", "Crop & download"],
  ["pdf-to-jpg", "Convert to JPG"],
  ["extract-images", "Extract images"],
  ["jpg-to-pdf", "Create PDF"],
  ["edit", "Save edited PDF"],
  ["add-text", "Add text"],
  ["sign", "Sign & download"],
  ["esign-request", "Create request PDF"],
  ["watermark", "Add watermark"],
  ["page-numbers", "Add numbers"],
  ["fill-form", "Fill & download"],
  ["create-form", "Create fillable PDF"],
  ["unlock", "Unlock & download"],
  ["protect", "Unlock & download"],
];

const stubs = [
  "compress",
  "repair",
  "compare",
  "pdf-to-word",
  "ocr",
  "redact",
  "summarizer",
];

const converters = [
  "km-to-mile",
  "m-to-ft",
  "usd-to-pkr",
  "multi-currency",
  "c-to-f",
  "kg-to-lb",
  "m2-to-ft2",
  "m-to-yard",
];

let fail = 0;

async function probe(path, needle, label) {
  const res = await fetch(base + path);
  const html = await res.text();
  const ok = res.status === 200 && html.toLowerCase().includes(needle.toLowerCase());
  console.log(`${ok ? "PASS" : "FAIL"} UI ${label} (${path})`);
  if (!ok) {
    fail++;
    if (res.status !== 200) console.log("  status", res.status);
    else console.log("  missing text:", needle);
  }
}

console.log("=== Client PDF tools (button text in HTML) ===");
for (const [slug, needle] of client) {
  await probe(`/tools/pdf/${slug}`, needle, slug);
}

console.log("\n=== Stub tools (Coming soon) ===");
for (const slug of stubs) {
  await probe(`/tools/pdf/${slug}`, "Coming soon", slug);
}

console.log("\n=== Converters (form present) ===");
for (const slug of converters) {
  await probe(`/convert/${slug}`, "Save", slug);
}

console.log(`\nFail: ${fail}`);
process.exit(fail ? 1 : 0);
