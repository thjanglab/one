# 국가 제조데이터뱅크 (가칭) — design source

This folder holds the Claude Design handoff the demo page was built from. It
is the source of truth: the React under `components/DataBank/generated/` is
compiled from `artboard.dc.html` and is regenerated, not edited.

| File | What it is |
| --- | --- |
| `artboard.dc.html` | The design prototype — markup and state class in one file |
| `support.js` | The prototype's template runtime, shipped with the handoff |
| `HANDOFF.md` | The design brief: tokens, screen-by-screen intent, interaction rules |
| `screenshots/` | The six screens as the designer captured them |

## Regenerating the React

```bash
node scripts/dc-to-tsx.mjs design/manufacturing-data-bank/artboard.dc.html \
  components/DataBank/generated
npm run build
```

The converter compiles `<sc-for>` / `<sc-if>` and `{{ }}` to JSX, lifts each
screen and modal into its own file, turns `style-hover` attributes into a
generated stylesheet, and renames the prototype's logic class into a React
component. Everything else — the element tree, the inline style strings, the
animation timings — comes across unchanged. See the header of
`scripts/dc-to-tsx.mjs` for how each construct is handled.

## Opening the prototype

The `.dc.html` file opens directly in a browser as long as `support.js` sits
beside it, which it does here. The runtime fetches React 18 from a CDN, so
that first load needs network access.

## Checking the port still matches

`scripts/compare-to-design.mjs` drives the prototype and the built page
through the same 35 steps and compares the position, size and text of every
rendered element after each one. Its header has the setup commands.

Last run: **32 of 35 states identical, 8 differing rows out of 21,210**, all
of them a count-up animation caught a digit apart mid-tween or a box a pixel
along its entrance. Running the prototype against *itself* produces the same
order of noise, so the port is not measurably distinguishable from the
design.

## Where the demo has since moved past the brief

The guided tour is 18 steps, not the 10 `HANDOFF.md` lists. The dashboard
leg went from one step to nine so the opening screen is walked through
rather than gestured at, and a tour step can now carry a `state` patch —
the axis steps switch the map to 제1축 and 제2축 as they are narrated, and
every dashboard step names the axis and region it expects, so stepping
backwards lands on the same screen as stepping forwards.

## One thing the brief describes that the artboard does not do

`HANDOFF.md` describes an upgrade prompt on the account screen's asset tower
— a dotted empty tier above Gold reading "Silver 12건 상향 시 +9,600만원",
which fills in when clicked. The state and the labels for it exist in the
prototype's logic (`towerUp`, `towerUpClick`, `towerUpLabelShown`), but no
markup in `artboard.dc.html` references them, so the prompt does not appear
in the prototype either. The port matches the artboard. Wiring it up is a
design change, not a porting fix.
