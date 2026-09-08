// Entry point for the 국가 제조데이터 라이브러리 현황 demo.
//
// It shows the shared passphrase gate first — see components/gate/passphrase.ts
// for what that check is and is not worth — and only then fetches the demo.

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import PassphraseGate from './components/gate/PassphraseGate';

/**
 * Fetches and mounts the demo once the gate is past.
 *
 * The demo takes the page over completely — the artboard positions itself
 * fixed and expects nothing else on screen — so it gets its own React root on
 * #databank-root rather than rendering inside the gate's tree.
 */
function DemoLoader() {
  useEffect(() => {
    let cancelled = false;
    import('./components/DataBank/mount').then(({ mountDemo }) => {
      if (cancelled) return;
      const root = document.getElementById('databank-root');
      if (root) mountDemo(root);
    });
    return () => { cancelled = true; };
  }, []);
  return null;
}

const rootElement = document.getElementById('databank-root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const gateNode = document.createElement('div');
document.body.appendChild(gateNode);
ReactDOM.createRoot(gateNode).render(
  <PassphraseGate
    title="국가 제조데이터 라이브러리 현황"
    subtitle="개념 시연 (Concept Demo)"
    note={<>제언하는 제도가 작동할 때의 모습을 보여주는 개념 시연입니다.
      실제 구현물이 아니며, 표시된 수치는 모두 예시값입니다.</>}
  >
    <DemoLoader />
  </PassphraseGate>
);
