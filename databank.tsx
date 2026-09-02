// Entry point for the 국가 제조데이터뱅크 concept demo (databank.html).
//
// Deliberately minimal: no Tailwind, no router, no providers. The demo is a
// single self-contained artboard and anything else on the page would change
// the metrics it was designed against.

import React from 'react';
import ReactDOM from 'react-dom/client';
import DataBankDemo from './components/DataBank/DataBankDemo';

const rootElement = document.getElementById('databank-root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// No StrictMode. The demo's opening sequences and count-ups are driven by
// timers started in componentDidMount, and StrictMode's double-invoked mount
// in development would run them twice.
ReactDOM.createRoot(rootElement).render(<DataBankDemo />);
