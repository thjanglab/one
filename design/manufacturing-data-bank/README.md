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

Last run: **33 of 35 states identical, 4 differing rows out of 21,210**, all
of them a count-up animation caught a digit apart mid-tween or a box a pixel
along its entrance. Running the prototype against *itself* produces the same
order of noise, so the port is not measurably distinguishable from the
design.

## Where the demo has since moved past the brief

The guided tour is 29 steps, not the 10 `HANDOFF.md` lists. The screens
carrying the argument are walked through rather than gestured at: 현황판
went from one step to nine, 계좌 to six (one of which opens the grade
modal), 예치 to six and 평가 to five. 운용 and 정책 are unchanged.

Two mechanisms made that possible. A tour step can carry a `state` patch
that `goStep` applies, and every step in those legs names the state it
narrates outright rather than inheriting what the last step left behind —
that is what makes stepping backwards land on the same screen as stepping
forwards, which a presenter who overshoots will do. And the tour overlay,
bubble and bar moved above the modal layer (z-index 118/120 against the
modals' 95), without which the grade-modal step would hide its own
`다음 ▶` button. Tooltips inside modals became visible as a side effect;
they were being drawn behind them before.

## One thing the brief describes that the artboard does not do

`HANDOFF.md` describes an upgrade prompt on the account screen's asset tower
— a dotted empty tier above Gold reading "Silver 12건 상향 시 +9,600만원",
which fills in when clicked. The state and the labels for it exist in the
prototype's logic (`towerUp`, `towerUpClick`, `towerUpLabelShown`), but no
markup in `artboard.dc.html` references them, so the prompt does not appear
in the prototype either. The port matches the artboard. Wiring it up is a
design change, not a porting fix.
