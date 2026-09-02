/**
 * Fidelity check for the 국가 제조데이터뱅크 demo.
 *
 * Drives the original design prototype and the built page through the same
 * script of clicks, and after every step compares the geometry and text of
 * every rendered element. A port that has drifted shows up as elements that
 * moved, resized, or stopped existing.
 *
 * Usage:
 *   node scripts/compare-to-design.mjs <designUrl> <buildUrl> [reportPath]
 *
 * Standing up the design side (it needs React 18 on the page, which the
 * prototype's runtime would otherwise pull from a CDN):
 *
 *   mkdir -p /tmp/dc && cd /tmp/dc && npm i react@18.3.1 react-dom@18.3.1
 *   cp node_modules/react/umd/react.production.min.js react.js
 *   cp node_modules/react-dom/umd/react-dom.production.min.js react-dom.js
 *   cp <repo>/design/manufacturing-data-bank/support.js .
 *   sed -e 's|<script src="./support.js"></script>|<script src="./react.js"></script><script src="./react-dom.js"></script><script src="./support.js"></script>|' \
 *       -e 's|<html>|<html lang="ko">|' \
 *       <repo>/design/manufacturing-data-bank/artboard.dc.html > index.html
 *   python3 -m http.server 4180
 *
 * The `lang` edit matters: the arrows `↻` and `⇅` are not in every font, and
 * the document language decides which fallback supplies them. Matching the
 * shipped page keeps the comparison about the port rather than about that.
 *
 * Then, against a production build served on 4173:
 *
 *   node scripts/compare-to-design.mjs \
 *     http://127.0.0.1:4180/index.html http://127.0.0.1:4173/databank.html
 *
 * Expect a handful of differing rows, not zero: the count-up animations are
 * sampled wherever they happen to be, so a figure mid-tween reads a digit
 * apart. Running the prototype against itself gives the same order of noise.
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

// Each step is a label and the labels to click to get there. State carries
// over between steps, the way it does in a live demo.
const STEPS = [
  ['map', []],
  ['map/axis1', ['제1축']],
  ['map/axis2', ['제2축']],
  ['map/all', ['전체']],
  ['map/region', ['10,670']],
  ['pop/firms', ['참여 기업']],
  ['pop/firms-close', ['✕']],
  ['pop/sets', ['누적 예치 건수']],
  ['pop/sets-close', ['✕']],
  ['pop/capacity', ['총 데이터 용량']],
  ['pop/cap-close', ['✕']],
  ['pop/money', ['이번 달 거래 정산액']],
  ['pop/money-close', ['✕']],
  ['pop/zone', ['참여 지역 · 세종 국가 허브 소재']],
  ['pop/zone-close', ['✕']],
  ['pop/records', ['전체 보기 →']],
  ['pop/rec-close', ['✕']],
  ['account', ['계좌']],
  ['account/more', ['더 보기 (+2)']],
  ['account/kind', ['적립']],
  ['account/axis1', ['제1축 범용 데이터']],
  ['account/grade', ['데이터 등급이란?']],
  ['account/grade-x', ['✕']],
  ['deposit', ['예치']],
  ['deposit/B', ['사출 공정 레시피 및 품질 파라미터']],
  ['deposit/compare', ['두 경로 나란히 보기']],
  ['evaluate', ['평가']],
  ['evaluate/sim', ['Gold 상향 시뮬레이션']],
  ['evaluate/reset', ['원상태로 되돌리기']],
  ['operate', ['운용']],
  ['operate/upgrade', ['Silver 12건을 Gold로 상향하면?']],
  ['operate/undo', ['되돌리기']],
  ['operate/funding', ['데이터 펀딩']],
  ['operate/invest', ['투자 참여 시뮬레이션']],
  ['policy', ['정책 대시보드']],
];

// Long enough for the slowest sequence on any screen to finish: the account
// screen's opening runs 3.5s.
const SETTLE = 2600;
const ENTRY = 5200;

async function run(url) {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const problems = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    // The prototype's runtime parses its own template through the HTML parser,
    // which complains about the unsubstituted SVG attributes it finds there.
    // Those are about the template source, not the rendered page.
    if (m.type() === 'error' && !/attribute (d|cx|cy|r|points|transform)/.test(m.text())) {
      problems.push(`console: ${m.text().slice(0, 160)}`);
    }
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(ENTRY);

  const snapshots = {};
  for (const [label, actions] of STEPS) {
    for (const text of actions) {
      // Clicked from inside the page rather than through Playwright's
      // actionability checks: several targets sit under the map's overlays.
      // React delegates from the root, so a bubbling click on the labelled
      // node still reaches whichever ancestor carries the handler.
      const hit = await page.evaluate((wanted) => {
        const norm = (s) => s.replace(/\s+/g, ' ').trim();
        const want = norm(wanted);
        const all = [...document.querySelectorAll('*')].filter((e) => norm(e.textContent || '') === want);
        const deepest = all.filter((e) => !all.some((o) => o !== e && e.contains(o)));
        if (!deepest[0]) return false;
        deepest[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return true;
      }, text);
      if (!hit) problems.push(`${label}: no element with text ${JSON.stringify(text)}`);
      await page.waitForTimeout(SETTLE);
    }
    if (!actions.length) await page.waitForTimeout(400);
    snapshots[label] = await page.evaluate(() => {
      const stage = [...document.querySelectorAll('div')].find(
        (d) => getComputedStyle(d).position === 'fixed' && d.style.inset === '0px');
      const rows = [];
      const walk = (el, depth) => {
        const r = el.getBoundingClientRect();
        const own = [...el.childNodes].filter((n) => n.nodeType === 3)
          .map((n) => n.nodeValue).join('').replace(/\s+/g, ' ').trim();
        rows.push([depth, el.tagName, Math.round(r.x), Math.round(r.y),
                   Math.round(r.width), Math.round(r.height), own.slice(0, 40)].join('|'));
        for (const c of el.children) walk(c, depth + 1);
      };
      if (stage) walk(stage, 0);
      return rows;
    });
  }
  await browser.close();
  return { snapshots, problems };
}

const designUrl = process.argv[2] || 'http://127.0.0.1:4180/index.html';
const buildUrl = process.argv[3] || 'http://127.0.0.1:4173/databank.html';
const reportPath = process.argv[4] || 'render-report/design-comparison.txt';

const design = await run(designUrl);
const build = await run(buildUrl);

let totalRows = 0;
let totalDiff = 0;
let statesMatching = 0;
const report = [`design: ${designUrl}`, `build:  ${buildUrl}`, ''];

for (const [label] of STEPS) {
  const a = design.snapshots[label] ?? [];
  const b = build.snapshots[label] ?? [];
  const n = Math.max(a.length, b.length);
  let diff = 0;
  const samples = [];
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      diff++;
      if (samples.length < 4) {
        samples.push(`      design ${a[i] ?? '(missing)'}\n      build  ${b[i] ?? '(missing)'}`);
      }
    }
  }
  totalRows += n;
  totalDiff += diff;
  if (!diff) statesMatching++;
  const counts = a.length === b.length ? `${a.length} elements` : `${a.length} vs ${b.length} ELEMENTS`;
  report.push(`${diff === 0 ? 'OK  ' : 'DIFF'} ${label.padEnd(20)} ${counts}${diff ? `, ${diff} differing` : ''}`);
  if (diff) report.push(...samples);
}

report.push('');
report.push(`${statesMatching}/${STEPS.length} states identical; ${totalDiff} differing rows of ${totalRows}`);
report.push(`design problems: ${design.problems.length ? '\n  ' + design.problems.join('\n  ') : 'none'}`);
report.push(`build problems:  ${build.problems.length ? '\n  ' + build.problems.join('\n  ') : 'none'}`);

const text = report.join('\n');
console.log(text);
try {
  writeFileSync(reportPath, text + '\n', 'utf8');
  console.log(`\nwritten to ${reportPath}`);
} catch (e) {
  console.error(`could not write ${reportPath}: ${e.message}`);
}

// Elements appearing or disappearing is a structural break, and that is what
// this check exists to catch. Pixel noise from a count-up is not.
const structural = STEPS.some(([label]) =>
  (design.snapshots[label] ?? []).length !== (build.snapshots[label] ?? []).length);
if (structural || build.problems.some((p) => p.startsWith('pageerror'))) process.exit(1);
