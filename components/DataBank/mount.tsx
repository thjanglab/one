// Mounting the demo lives behind its own module so gate.tsx can pull it in
// with a dynamic import — the bundle is not fetched until the passphrase is
// accepted.

import React from 'react';
import ReactDOM from 'react-dom/client';
import DataBankDemo from './DataBankDemo';

export function mountDemo(root: HTMLElement) {
  // No StrictMode. The demo's opening sequences and count-ups are driven by
  // timers started in componentDidMount, and StrictMode's double-invoked
  // mount in development would run them twice.
  ReactDOM.createRoot(root).render(<DataBankDemo />);
}
