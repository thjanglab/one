/**
 * Renders every route in a real browser and fails if any of them
 * throws, logs a console error, or comes back visually empty.
 *
 * Usage: node scripts/verify-render.mjs [baseUrl]
 * Screenshots are written to ./render-report/.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = (process.argv[2] || 'http://localhost:4173').replace(/\/$/, '');
const OUT = 'render-report';

const ROUTES = [
  'overview', 'portal', 'pcf', 'dpp', 'intelligent-scm', 'supply-chain',
  'security', 'framework', 'marketplace', 'usecases', 'demonstration',
  'edc-simulation', 'identity-sim', 'dashboard', 'connector', 'blockchain',
  'clearinghouse', 'preprocessing', 'energy', 'guideline', 'tutorial',
  'asset/recipe_ai', 'asset/data_batt_cycle',
];

// Every target the check visits: the SPA's hash routes plus the standalone
// pages that are their own build entry. The demo reads its copy off the stage
// rather than a <main>, and its opening sequence runs for about 3.5s.
const TARGETS = [
  ...ROUTES.map((route) => ({
    name: `/${route}`,
    url: `${BASE}/#/${route}`,
    text: () => document.querySelector('main')?.innerText.trim() ?? '',
    settle: 1500,
  })),
  {
    name: 'databank.html',
    url: `${BASE}/databank.html`,
    text: () => document.body.innerText.trim(),
    settle: 4500,
  },
];

// Assets that legitimately live on third-party hosts. A blocked CDN in a
// sandboxed runner must not be reported as an application defect.
const EXTERNAL = /^https?:\/\/(?!localhost|127\.0\.0\.1)/;

const MIN_TEXT = 100; // a rendered screen always has more copy than this

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await mkdir(OUT, { recursive: true });

const results = [];
let failed = 0;

// Hot-linked imagery (Unsplash stock photos, generated QR codes) is not
// bundled with the app, so whether it actually loads depends on the network
// the browser sits behind. Count it here: a blocked CDN must not fail the
// run, but it should be visible in the log rather than silently missing.
const external = { loaded: 0, blocked: 0, hosts: new Map() };
const noteHost = (url, key) => {
  let host;
  try { host = new URL(url).host; } catch { host = url; }
  const entry = external.hosts.get(host) || { loaded: 0, blocked: 0 };
  entry[key]++;
  external.hosts.set(host, entry);
};
page.on('response', (res) => {
  if (!EXTERNAL.test(res.url())) return;
  if (res.status() < 400) { external.loaded++; noteHost(res.url(), 'loaded'); }
  else { external.blocked++; noteHost(res.url(), 'blocked'); }
});
page.on('requestfailed', (r) => {
  if (!EXTERNAL.test(r.url())) return;
  external.blocked++;
  noteHost(r.url(), 'blocked');
});

for (const target of TARGETS) {
  const problems = [];
  const onPageError = (e) => problems.push(`uncaught: ${e.message}`);
  const onConsole = (m) => {
    if (m.type() !== 'error') return;
    // "Failed to load resource" duplicates requestfailed; keep the real errors.
    if (/Failed to load resource/.test(m.text())) return;
    problems.push(`console: ${m.text()}`);
  };
  const onRequestFailed = (r) => {
    if (EXTERNAL.test(r.url())) return; // offline runner, not our bug
    problems.push(`request failed: ${r.url()} (${r.failure()?.errorText})`);
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  page.on('requestfailed', onRequestFailed);

  await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(target.settle); // let animations and charts settle

  const text = await page.evaluate(target.text);

  page.off('pageerror', onPageError);
  page.off('console', onConsole);
  page.off('requestfailed', onRequestFailed);

  if (text.length < MIN_TEXT) problems.push(`rendered only ${text.length} chars of text`);

  const name = target.name.replace(/^\//, '').replace(/\//g, '_');
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

  const ok = problems.length === 0;
  if (!ok) failed++;
  results.push({ route: target.name, ok, chars: text.length, problems });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${target.name.padEnd(23)} text=${String(text.length).padStart(6)}${problems.length ? '  ' + problems.join(' | ') : ''}`);
}

await browser.close();
await writeFile(`${OUT}/report.json`, JSON.stringify(results, null, 2));

console.log(`\n${results.length - failed}/${results.length} screens rendered cleanly.`);

const summary = [
  `### Render check`,
  ``,
  `${results.length - failed}/${results.length} screens rendered cleanly.`,
  ``,
  `Externally hosted assets: **${external.loaded} loaded, ${external.blocked} blocked**`,
  ``,
  `| Host | Loaded | Blocked |`,
  `| --- | ---: | ---: |`,
  ...[...external.hosts].sort().map(([host, n]) => `| ${host} | ${n.loaded} | ${n.blocked} |`),
  ``,
  external.blocked > 0
    ? `Blocked third-party assets do not fail this check - the app itself still rendered.`
    : `All hot-linked imagery resolved.`,
].join('\n');

console.log('\n' + summary);
await writeFile(`${OUT}/summary.md`, summary + '\n');
if (failed > 0) {
  console.error(`${failed} screen(s) failed. Screenshots in ./${OUT}/`);
  process.exit(1);
}
