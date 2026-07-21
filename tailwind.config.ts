import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          background: 'var(--color-app-background)',
          surface: 'var(--color-app-surface)',
          surfaceMuted: 'var(--color-app-surface-muted)',
          surfacePressed: 'var(--color-app-surface-pressed)',
          border: 'var(--color-app-border)',
          text: 'var(--color-app-text)',
          textMuted: 'var(--color-app-text-muted)',
        },
      },
      borderRadius: {
        control: 'var(--radius-control)',
        panel: 'var(--radius-panel)',
      },
      boxShadow: {
        lift: 'var(--shadow-lift)',
        inset: 'var(--shadow-inset)',
      },
    },
  },
  plugins: [],
} satisfies Config;
