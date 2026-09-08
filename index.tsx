import './index.css';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import PassphraseGate from './components/gate/PassphraseGate';

// Behind the gate, so the platform's bundle is not sitting in the network tab
// of someone who never got in.
const App = React.lazy(() => import('./App'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PassphraseGate
      title="Korea DataSpace Platform"
      subtitle="국가 제조데이터 스페이스 · 개념 시연 (Concept Demo)"
      note={<>Catena-X · GAIA-X 원칙을 따르는 산업 데이터스페이스의 개념 시연입니다.
        실제 운영 시스템이 아니며, 표시된 수치와 기업 정보는 모두 예시값입니다.</>}
    >
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </PassphraseGate>
  </React.StrictMode>
);
