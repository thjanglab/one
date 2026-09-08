// The passphrase check shared by the platform and the data-library demo.
//
// Be clear about what this is and is not. GitHub Pages serves static files
// with no server-side auth, so the check runs in the visitor's own browser and
// anyone willing to open devtools gets past it. What it buys is that neither
// page is readable by someone who merely has the link, and — because both
// bundles arrive through a dynamic import — nothing is even fetched until the
// passphrase is right.
//
// The passphrase is stored as a SHA-256 digest rather than in the clear so it
// is not a grep-able string in the shipped JavaScript. That is a speed bump,
// not a secret: a short passphrase is cheap to brute-force offline against a
// known digest. If this ever needs to actually keep people out, it needs a
// host that can refuse the request — see
// design/manufacturing-data-bank/README.md.

import { useEffect, useState } from 'react';

export const PASSPHRASE_SHA256 =
  '9a1c6c514e48df18d006295350a234263da33ef088de7cc835dc33f161e06384';

// Per tab, not per browser: a reload mid-presentation should not re-prompt,
// but the next person to open the podium machine should have to ask. The two
// pages share the key deliberately — one code, entered once, opens both.
export const UNLOCKED_KEY = 'kds-unlocked';

export const GATE_FONT =
  "'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕','Noto Sans KR','Nanum Gothic',sans-serif";

export function isUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCKED_KEY) === '1';
  } catch {
    return false; // private mode
  }
}

export function rememberUnlocked() {
  try {
    sessionStorage.setItem(UNLOCKED_KEY, '1');
  } catch {
    /* private mode — the tab just re-prompts on reload */
  }
}

export async function matches(entered: string) {
  const bytes = new TextEncoder().encode(entered);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex === PASSPHRASE_SHA256;
}

/**
 * Enters fullscreen, the way pressing F11 would look.
 *
 * The browser only grants this off a user gesture, which is why callers run it
 * straight from a click handler. It can still be refused (iOS Safari does not
 * do fullscreen on anything but video, and a policy can forbid it), so the
 * result is swallowed: a refused request must not stop the page from opening.
 */
export async function enterFullscreen() {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
  };
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
  } catch {
    /* refused or unsupported — open windowed instead */
  }
}

export function toggleFullscreen() {
  const el = document.documentElement;
  const p = document.fullscreenElement
    ? document.exitFullscreen?.()
    : el.requestFullscreen?.({ navigationUI: 'hide' });
  if (p && p.catch) p.catch(() => {});
}

/**
 * Tracks whether the document is fullscreen, rather than what the caller last
 * asked for — so F11, Esc and the gate's own request all move it, and a
 * refused request leaves a switch reading off instead of lying.
 */
export function useFullscreen() {
  const [isFull, setIsFull] = useState(false);
  useEffect(() => {
    const sync = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    sync();
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  return { isFull, toggle: toggleFullscreen };
}
