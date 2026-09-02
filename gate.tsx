// Entry point for the 국가 제조데이터 라이브러리 현황 demo.
//
// The demo is handed out for external seminars, so it asks for a passphrase
// before it will load. Be clear about what that is and is not: GitHub Pages
// serves static files with no server-side auth, so this check runs in the
// visitor's own browser and anyone willing to open devtools gets past it.
// What it does buy is that the page is not readable by someone who merely
// has the link, and — because the demo is behind a dynamic import — its
// bundle is not even fetched until the passphrase is right.
//
// The passphrase is stored as a SHA-256 digest rather than in the clear so
// it is not a grep-able string in the shipped JavaScript. That is a
// speed bump, not a secret: a short passphrase is cheap to brute-force
// against a known digest offline. If this ever needs to actually keep
// people out, it needs a host that can refuse the request — see
// design/manufacturing-data-bank/README.md.

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

const PASSPHRASE_SHA256 = '9a1c6c514e48df18d006295350a234263da33ef088de7cc835dc33f161e06384';

// Per tab, not per browser: a reload mid-presentation should not re-prompt,
// but the next person to open the podium machine should have to ask.
const UNLOCKED_KEY = 'databank-unlocked';

const FONT = "'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕','Noto Sans KR','Nanum Gothic',sans-serif";

/**
 * Goes fullscreen, the way pressing F11 would look.
 *
 * The browser only grants this off a user gesture, which is why it is called
 * from the submit handler rather than after the demo mounts — the click on
 * 열기 is the gesture. It can still be refused (iOS Safari does not do
 * fullscreen on anything but video, and a policy can forbid it), so the
 * result is ignored: a refused request must not stop the demo from opening.
 */
async function goFullscreen() {
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

async function matches(entered: string) {
  const bytes = new TextEncoder().encode(entered);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex === PASSPHRASE_SHA256;
}

function Gate() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  // On by default: the demo is a fixed stage meant to fill a projector. Left
  // as a choice because a presenter sharing a single window in a video call
  // wants the opposite.
  const [fullscreen, setFullscreen] = useState(true);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let remembered = false;
    try { remembered = sessionStorage.getItem(UNLOCKED_KEY) === '1'; } catch { /* private mode */ }
    if (remembered) setUnlocked(true);
    else input.current?.focus();
  }, []);

  // The demo only arrives once the passphrase is right, so the bundle is not
  // sitting in the network tab of someone who never got in.
  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    import('./components/DataBank/mount').then(({ mountDemo }) => {
      if (cancelled) return;
      const root = document.getElementById('databank-root');
      if (root) mountDemo(root);
    });
    return () => { cancelled = true; };
  }, [unlocked]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    setError('');
    const ok = await matches(value.trim());
    setChecking(false);
    if (!ok) {
      setError('접속 코드가 맞지 않습니다.');
      setValue('');
      input.current?.focus();
      return;
    }
    try { sessionStorage.setItem(UNLOCKED_KEY, '1'); } catch { /* private mode */ }
    // Before unmounting the gate, while this click still counts as a gesture.
    if (fullscreen) await goFullscreen();
    setUnlocked(true);
  };

  if (unlocked) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#D8DBDF', fontFamily: FONT, WebkitFontSmoothing: 'antialiased', padding: 24,
    }}>
      <form
        onSubmit={submit}
        style={{
          width: 420, maxWidth: '100%', background: '#fff', borderRadius: 6,
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
        }}
      >
        <div style={{ background: '#1F4E79', padding: '22px 28px' }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px' }}>
            국가 제조데이터 라이브러리 현황
          </div>
          <div style={{ color: '#A9C3DC', fontSize: 12.5, marginTop: 6 }}>
            개념 시연 (Concept Demo)
          </div>
        </div>

        <div style={{ padding: '24px 28px 26px' }}>
          <label
            htmlFor="code"
            style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3A3E44', marginBottom: 8 }}
          >
            접속 코드
          </label>
          <input
            id="code"
            ref={input}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            style={{
              width: '100%', boxSizing: 'border-box', border: '1px solid #DDE1E5', borderRadius: 3,
              padding: '11px 13px', fontSize: 14, fontFamily: 'inherit', color: '#1A1D21', outline: 'none',
            }}
          />
          <div style={{ minHeight: 20, marginTop: 8, fontSize: 12, color: '#C0392B' }}>{error}</div>

          <label
            style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, marginBottom: 14,
              fontSize: 12.5, color: '#5B5F66', cursor: 'pointer', userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={fullscreen}
              onChange={(e) => setFullscreen(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: '#1F4E79', cursor: 'pointer' }}
            />
            전체화면으로 열기
          </label>

          <button
            type="submit"
            disabled={checking || !value.trim()}
            style={{
              width: '100%', border: 'none', borderRadius: 3, padding: '12px 0',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit', letterSpacing: '-0.3px',
              color: '#fff', background: value.trim() ? '#1F4E79' : '#9BA7B2',
              cursor: value.trim() && !checking ? 'pointer' : 'default',
            }}
          >
            {checking ? '확인 중…' : '열기'}
          </button>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #EDEFF1', fontSize: 11.5, lineHeight: 1.7, color: '#7A8089' }}>
            제언하는 제도가 작동할 때의 모습을 보여주는 개념 시연입니다.
            실제 구현물이 아니며, 표시된 수치는 모두 예시값입니다.
          </div>
        </div>
      </form>
    </div>
  );
}

const rootElement = document.getElementById('databank-root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// The gate renders into its own node so the demo can take the page over
// completely once it is past — the artboard positions itself fixed and
// expects nothing else on screen.
const gateNode = document.createElement('div');
document.body.appendChild(gateNode);
ReactDOM.createRoot(gateNode).render(<Gate />);
