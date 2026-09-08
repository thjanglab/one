// The passphrase screen both entry points show before anything else loads.
//
// It styles itself inline rather than with Tailwind: the data-library demo is
// a separate build entry with no Tailwind at all — deliberately, since the
// base stylesheet would pull its fixed 1600×900 stage off the metrics it was
// designed against — and one gate that renders the same on both pages is
// worth more than one that matches each page's stack.

import React, { useEffect, useRef, useState } from 'react';
import { GATE_FONT, enterFullscreen, isUnlocked, matches, rememberUnlocked } from './passphrase';

export default function PassphraseGate({
  title,
  subtitle,
  note,
  children,
}: {
  title: string;
  subtitle: string;
  note: React.ReactNode;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  // On by default: both pages are meant to fill a projector, and fullscreen
  // is also what keeps the URL off it. Left as a choice because a presenter
  // sharing a single window in a video call wants the opposite.
  const [fullscreen, setFullscreen] = useState(true);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUnlocked()) setUnlocked(true);
    else input.current?.focus();
  }, []);

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
    rememberUnlocked();
    // Before unmounting the gate, while this click still counts as a gesture.
    if (fullscreen) await enterFullscreen();
    setUnlocked(true);
  };

  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex',
      alignItems: 'center', justifyContent: 'center', background: '#D8DBDF',
      fontFamily: GATE_FONT, WebkitFontSmoothing: 'antialiased', padding: 24,
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
            {title}
          </div>
          <div style={{ color: '#A9C3DC', fontSize: 12.5, marginTop: 6 }}>{subtitle}</div>
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

          <div style={{
            marginTop: 18, paddingTop: 16, borderTop: '1px solid #EDEFF1',
            fontSize: 11.5, lineHeight: 1.7, color: '#7A8089',
          }}>
            {note}
          </div>
        </div>
      </form>
    </div>
  );
}
