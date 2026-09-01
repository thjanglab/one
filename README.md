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

## Verifying that every screen renders

`npm run verify:render` opens all 23 routes in a real browser and fails if
any of them throws, logs a console error, fails a local request, or comes
back visually empty. Screenshots and a JSON report land in `render-report/`.

```bash
npm run build
npx vite preview --port 4173 &
npm run verify:render -- http://127.0.0.1:4173
```

Third-party asset hosts (fonts, stock imagery) are ignored by the check so
that an offline or firewalled runner is not reported as an application bug.

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
| `npm run verify:render` | Browser render check across every route |

`index.css` is generated, not committed. `npm run dev` and `npm run build`
regenerate it automatically; run `npm run css` yourself if you change class
names while the dev server is already running.
