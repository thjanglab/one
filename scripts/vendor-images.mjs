/**
 * Downloads the hot-linked Unsplash imagery into public/vendor-images/ and
 * rewrites the source to point at the local copies.
 *
 * The app referenced every photo straight from images.unsplash.com, so the
 * imagery only appeared on networks that can reach that host. Vendoring makes
 * the build self-contained.
 *
 * Paths are written without a leading slash. The app uses hash routing, so the
 * document path never changes and a relative URL resolves correctly whether the
 * site is served from the root or from a sub-path such as /one/.
 *
 * Run where the network allows it (CI): node scripts/vendor-images.mjs
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'public/vendor-images';
const REF_PREFIX = 'vendor-images';
const HOST = 'https://images.unsplash.com/';

async function sourceFiles(dir = '.') {
  const skip = new Set(['node_modules', '.git', 'dist', 'public', 'render-report']);
  const found = [];
  for (const entry of await readdir(dir)) {
    if (skip.has(entry)) continue;
    const full = path.join(dir, entry);
    if ((await stat(full)).isDirectory()) found.push(...(await sourceFiles(full)));
    else if (/\.tsx?$/.test(entry)) found.push(full);
  }
  return found;
}

// Stable filename per distinct URL: the photo slug plus the size it was
// requested at, since the same photo is used at several widths.
function fileNameFor(url) {
  const { pathname, searchParams } = new URL(url);
  const slug = pathname.replace(/^\//, '').replace(/[^a-zA-Z0-9-]/g, '_');
  const width = searchParams.get('w');
  return `${slug}${width ? `-w${width}` : ''}.jpg`;
}

const files = await sourceFiles();
const urls = new Set();
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const m of text.matchAll(/https:\/\/images\.unsplash\.com\/[^"'`\s)]+/g)) {
    urls.add(m[0]);
  }
}

if (urls.size === 0) {
  console.log('No hot-linked Unsplash URLs left - nothing to vendor.');
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });
console.log(`Downloading ${urls.size} images from ${HOST}\n`);

const mapping = new Map();
let bytes = 0;
let failed = 0;

for (const url of [...urls].sort()) {
  const name = fileNameFor(url);
  const dest = path.join(OUT_DIR, name);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    bytes += buf.length;
    mapping.set(url, `${REF_PREFIX}/${name}`);
    console.log(`  ok    ${(buf.length / 1024).toFixed(0).padStart(5)} KB  ${name}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL  ${url}\n        ${err.message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} download(s) failed - not rewriting any source.`);
  process.exit(1);
}

let rewritten = 0;
for (const file of files) {
  const text = await readFile(file, 'utf8');
  let next = text;
  for (const [url, local] of mapping) next = next.split(url).join(local);
  if (next !== text) {
    await writeFile(file, next);
    rewritten++;
    console.log(`rewrote ${file}`);
  }
}

console.log(`\nVendored ${mapping.size} images (${(bytes / 1024 / 1024).toFixed(1)} MB) into ${OUT_DIR}`);
console.log(`Rewrote ${rewritten} source file(s).`);
