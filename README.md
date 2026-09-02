# Korea DataSpace Platform

B2B industrial data marketplace built on Catena-X and GAIA-X principles.
React 19 + TypeScript + Vite, with Tailwind compiled locally.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Routing is hash-based, so every screen has
a shareable URL such as `http://localhost:3000/#/marketplace`.

The Gemini API key is optional: it is only used by the video demo on the
Tutorial screen. To enable it, put your key in `.env.local`:

```
GEMINI_API_KEY=your-key-here
```

Everything else runs without it.

## 국가 제조데이터 라이브러리 현황 demo

`http://localhost:3000/d/7k2q9x/` is a six-screen concept demo of the
proposed National Manufacturing Data Bank — 현황판 · 계좌 · 예치 · 평가 ·
운용 · 정책 대시보드 — built for showing at government briefings. Every
figure on it is illustrative, which the bar across the top says outright.

It asks for a passphrase, which is not in this repository: the demo is
handed out for external seminars and the passphrase goes with it. Be clear
about what that check is worth — GitHub Pages has no server-side auth, so it
runs in the visitor's browser and anyone willing to open devtools gets past
it. It keeps the page from being readable by someone who merely has the
link, and holds the demo bundle back behind a dynamic import until the
passphrase is right; it is not access control. `gate.tsx` says the same at
the top, and `design/manufacturing-data-bank/README.md` covers what real
gating would take.

The path is unlisted for the same reason, and nothing on the platform links
to it. The page carries `noindex`; a `robots.txt` would do nothing, since
crawlers only read one at the domain root and a project page does not own
that.

It is a **separate page, not a route**. It runs on a fixed 1600×900 stage
scaled to the window and styles `html` and `body` itself, and the platform's
Tailwind base stylesheet — which resets box-sizing, borders and line-height —
would pull it off the metrics it was designed against. Keeping it on its own
entry is what makes it match the design pixel for pixel.

The screens are compiled from the Claude Design handoff rather than
hand-written, so a design change means re-running the converter rather than
chasing edits through the markup:

```bash
node scripts/dc-to-tsx.mjs design/manufacturing-data-bank/artboard.dc.html \
  components/DataBank/generated
```

`design/manufacturing-data-bank/README.md` covers the source files, how to
open the original prototype, and how the port is verified against it.

## Verifying that every screen renders

`npm run verify:render` opens all 23 routes plus the demo — once at its gate
and once past it — in a real browser, and fails if any of them throws, logs a
console error, fails a local request, or comes back visually empty. It gets
past the gate by setting the same session flag the gate sets, so the
passphrase stays out of the repository. Screenshots and a JSON report land in
`render-report/`.

```bash
npm run build
npx vite preview --port 4173 &
npm run verify:render -- http://127.0.0.1:4173
```

Third-party asset hosts are ignored by the check so that an offline or
firewalled runner is not reported as an application bug. The check still
counts them and prints a per-host tally, so a link that has gone dead shows
up instead of silently rendering nothing.

## Imagery

The photos live in `public/vendor-images/` and are referenced by relative
path, so the app renders its imagery offline and behind restrictive
networks. They were originally hot-linked from Unsplash, which meant they
appeared only where that host was reachable.

`.github/workflows/vendor-images.yml` is what downloaded them, via
`scripts/vendor-images.mjs`. Re-running it is a no-op now that nothing
points at images.unsplash.com; it is kept for the next time imagery is
added by URL. The script refuses to rewrite anything if any download fails,
so a dead link stops the run rather than half-applying.

The same check runs in CI on every push — see
`.github/workflows/deploy.yml`. The screenshots it captures are attached to
each run as the `render-report` artifact, so you can look at what CI
actually saw.

## Publishing

The workflow deploys `dist/` to GitHub Pages after the render check passes.

GitHub Pages has to be switched on once by hand, because the workflow token
is not allowed to create the Pages site: go to **Settings → Pages → Build
and deployment** and set **Source** to **GitHub Actions**. Until that is
done the deploy step is skipped with a warning and the build still passes.

The site is served from a sub-path, which is why `base` is `./` in
`vite.config.ts`. Combined with hash routing, the same build works from any
directory.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Compile Tailwind, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run css` | Rebuild `index.css` from `tailwind.src.css` |
| `npm run verify:render` | Browser render check across every screen |
| `node scripts/dc-to-tsx.mjs` | Recompile the data bank demo from its design source |
| `node scripts/compare-to-design.mjs` | Check that demo against the design prototype |

`index.css` is generated, not committed. `npm run dev` and `npm run build`
regenerate it automatically; run `npm run css` yourself if you change class
names while the dev server is already running.

## Versions

Tagged versions are listed in [CHANGELOG.md](CHANGELOG.md). `v1.0.0` is the
first one.

```bash
git tag -l -n1              # what tags exist, with their subject
git show v1.0.0             # what that version was
git diff v1.0.0..HEAD       # what has changed since
```

To go back:

```bash
git switch -c from-v1.0.0 v1.0.0   # branch off the tag, current branch untouched
git revert <commit>                # undo one commit, keeping history
git reset --hard v1.0.0            # discard everything after the tag - destructive
```

`git switch` is the safe one and is usually what you want: it leaves the
branch you are on exactly as it is.

A commit works anywhere a tag does, so if a tag has not been published yet,
use the commit it names instead:

```bash
git log --oneline            # find the commit
git switch -c from-there <commit>
```
