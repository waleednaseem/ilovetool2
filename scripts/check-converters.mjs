import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const base = process.argv[2] || "http://localhost:3000";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/lib/converters/registry.ts"), "utf8");
const pairSlugs = [...src.matchAll(/pair\(\s*"([^"]+)"/g)].map((m) => m[1]);
const objSlugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const all = [...new Set([...pairSlugs, ...objSlugs])];

let fail = 0;
for (const s of all) {
  const r = await fetch(`${base}/convert/${s}`);
  const ok = r.status === 200;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"} /convert/${s} ${r.status}`);
}
console.log(`\nConverters: ${all.length} fail: ${fail}`);
process.exit(fail ? 1 : 0);
