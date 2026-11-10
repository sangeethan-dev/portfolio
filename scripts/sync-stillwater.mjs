/*
 * Copies the Stillwater Psychology concept site (a separate plain-HTML
 * project) into public/work/stillwater-psychology/ and rewrites it to run
 * under that path:
 *   - relative asset paths become /work/stillwater-psychology/…
 *     (Next strips the trailing slash, so relative paths would break)
 *   - the fictional domain in canonical/og/JSON-LD points at the page instead
 *   - noindex, so nobody searching for a real psychologist lands on it
 *
 * Usage: node scripts/sync-stillwater.mjs [path-to-source]
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const SRC = resolve(process.argv[2] || "../stillwater-psychology");
const BASE = "/work/stillwater-psychology";
const DEST = resolve("public", "work", "stillwater-psychology");
const FILES = ["index.html", "styles.css", "main.js", "site-config.js", "favicon.svg", "og-image.png"];

if (!existsSync(join(SRC, "index.html"))) {
  console.error(`No index.html in ${SRC}`);
  process.exit(1);
}

rmSync(join(DEST, "images"), { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
for (const f of FILES) cpSync(join(SRC, f), join(DEST, f));
cpSync(join(SRC, "images"), join(DEST, "images"), { recursive: true });

let html = readFileSync(join(DEST, "index.html"), "utf8");
html = html
  .replace(/(src|href)="(images\/|styles\.css|favicon\.svg|site-config\.js|main\.js)/g, `$1="${BASE}/$2`)
  .replace(/https:\/\/stillwaterpsychology\.com\.au\/og-image\.png/g, `${BASE}/og-image.png`)
  .replace(/https:\/\/stillwaterpsychology\.com\.au\/"/g, `${BASE}"`)
  .replace(
    /(<link rel="canonical"[^>]*>)/,
    `$1\n  <!-- Concept build inside the portfolio: kept out of search so nobody looking\n       for a real psychologist lands here. -->\n  <meta name="robots" content="noindex, nofollow">`
  );
writeFileSync(join(DEST, "index.html"), html);

const leftovers = html.match(/(?:src|href)="(?!https?:|\/|#|tel:|mailto:)[^"]+"/g);
console.log(`Synced ${SRC} -> ${DEST}`);
if (leftovers) console.warn("Relative paths left unrewritten:", leftovers);
