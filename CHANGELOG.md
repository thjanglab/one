# Changelog

## v1.0.0

First tagged version. The app builds, every screen renders, and nothing it
draws depends on a third-party host any more.

### Fixed

- **Build failure.** Bare `>` characters in JSX text in `Guideline` were
  rejected by esbuild, so the project did not build at all. Escaped as
  `-&gt;`, leaving the rendered output unchanged.
- **Missing SVG connections.** `SecurityModule` used percentage coordinates
  in `<path d>` and `animateMotion path`, which SVG does not allow, so the
  P2P connection lines and the metadata flow lines never drew. Switched to
  the numeric `viewBox="0 0 100 100"` pattern already used elsewhere in the
  same file, and moved the "Metadata Only" label out of the stretched
  viewBox so its text is not distorted.
- **Missing grain texture.** The film-grain overlay on the transaction map
  and the AI use-case cards was hot-linked from a demo site that no longer
  serves the file, so it had never appeared. Replaced with an equivalent
  `feTurbulence` SVG inlined as a data URI.
- **Dead tutorial photo.** The image for "Data Plane Transfer (EDR)"
  returned 404; the photo had been removed from Unsplash. Points at the shot
  the marketplace walkthrough uses for its transfer step.

### Changed

- **Naming.** Every occurrence of INTERX / 인터엑스 is now Korea, including
  DIDs, localStorage keys, asset ids and the `InterX` spelling used in the
  contract and certificate blocks.
- **Wordmark.** Two lines at the same size: "Korea" over
  "Manufacturing-X", with the orange mark at the X position.
- **Korea HQ (Seoul) partners.** 6 entities to 17: adds KITECH, KIAT, KEIT,
  Naver Cloud, onepredict, MakinaRocks, HYUNDAI, KIA, LG, SK and SAMSUNG.
- **Imagery.** All 59 photos are served from `public/vendor-images/` instead
  of images.unsplash.com, so they render offline and behind restrictive
  networks.
- **Styling.** Tailwind is compiled locally rather than pulled from the play
  CDN, which removes the production CDN warning and one network dependency.
- **Base path.** `base` is relative, so the build works when served from a
  sub-path such as `/one/`.
- **API key.** `API_KEY` falls back to an empty string, so the build runs
  without `.env.local`. The key is only used by the Gemini demo in Tutorial.

### Added

- `scripts/verify-render.mjs` opens all 23 routes in a real browser and
  fails on any uncaught error, console error, failed local request, or
  near-empty screen. It also tallies externally hosted assets per host, so a
  link that has gone dead is visible instead of silently rendering nothing.
- `.github/workflows/deploy.yml` runs that check against the production
  build on every push, uploads the screenshots, and deploys to GitHub Pages.
- `.github/workflows/vendor-images.yml` downloads referenced imagery into
  the repository and commits it.

### Known state

- GitHub Pages has not been enabled yet, so the deploy step is skipped with
  a warning. See the Publishing section of the README.
- The only remaining external requests are the Google Fonts stylesheet and
  its font files.
