import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Relative asset paths so the build also works when served from a
      // sub-path (e.g. GitHub Pages: /one/). HashRouter handles the routes.
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            // The platform SPA.
            main: path.resolve(__dirname, 'index.html'),
            // The 국가 제조데이터뱅크 concept demo, on its own page so it does
            // not inherit the platform's Tailwind base styles. See
            // databank.html for why that matters.
            databank: path.resolve(__dirname, 'databank.html'),
          },
        },
      },
      define: {
        // Fall back to an empty string so the build works without .env.local
        // (the key is only needed for the Gemini video demo in Tutorial).
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
