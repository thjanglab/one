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

for (const route of ROUTES) {
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

  await page.goto(`${BASE}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(1500); // let animations and charts settle

  const text = await page.evaluate(() => document.querySelector('main')?.innerText.trim() ?? '');

  page.off('pageerror', onPageError);
  page.off('console', onConsole);
  page.off('requestfailed', onRequestFailed);

  if (text.length < MIN_TEXT) problems.push(`rendered only ${text.length} chars of text`);

  const name = route.replace(/\//g, '_');
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

  const ok = problems.length === 0;
  if (!ok) failed++;
  results.push({ route, ok, chars: text.length, problems });
  console.log(`${ok ? 'PASS' : 'FAIL'}  /${route.padEnd(22)} text=${String(text.length).padStart(6)}${problems.length ? '  ' + problems.join(' | ') : ''}`);
}

await browser.close();
await writeFile(`${OUT}/report.json`, JSON.stringify(results, null, 2));

console.log(`\n${results.length - failed}/${results.length} routes rendered cleanly.`);
if (failed > 0) {
  console.error(`${failed} route(s) failed. Screenshots in ./${OUT}/`);
  process.exit(1);
}
