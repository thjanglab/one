// 국가 제조데이터뱅크 (가칭) — concept demo.
//
// A six-screen walkthrough of the proposed National Manufacturing Data Bank,
// ported from the Claude Design handoff in `design/manufacturing-data-bank/`.
// Every figure on screen is illustrative; the top bar says so, and that
// notice is part of the design rather than a placeholder to remove.
//
// The screens under `generated/` and the state class they render against are
// produced by `scripts/dc-to-tsx.mjs` from `artboard.dc.html`. Change the
// design, re-run the converter; do not edit the generated files by hand.

import React from 'react';
import { DataBankLogic } from './generated/logic';
import Artboard from './generated/Artboard';

import './generated/atomics.css';
import './generated/hover.css';

// The design styles `html` and `body` directly — full height, no scrolling,
// its own background and font stack. Those rules are scoped to this class in
// `atomics.css` so they only apply while the demo is on screen and leave the
// rest of the app alone. Keep it in step with SCOPE_CLASS in the converter.
const SCOPE_CLASS = 'dc-databank';

/**
 * The demo runs on a fixed 1600×900 stage that is scaled to fit the window,
 * so it fills the viewport rather than sitting inside the app's sidebar
 * layout. `App.tsx` routes it outside that shell for the same reason.
 */
export default class DataBankDemo extends DataBankLogic {
  componentDidMount() {
    document.documentElement.classList.add(SCOPE_CLASS);
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.documentElement.classList.remove(SCOPE_CLASS);
  }

  render() {
    return <Artboard v={this.renderVals()} />;
  }
}
