/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          // Deep cosmic backdrops
          darkest: '#030712', // Deepest space black/navy
          dark: '#070b16',    // Secondary background
          surface: '#0f172a', // Subtle charcoal/navy panel surface
          'surface-elevated': '#162038', // Elevated cards
          border: '#1e293b',  // Subtle hairline border
          'border-subtle': 'rgba(51, 65, 85, 0.4)', // Translucent border

          // Refined accents (controlled, not neon)
          accent: '#38bdf8',          // Refined electric blue
          'accent-hover': '#7dd3fc',  // Hover blue
          'accent-muted': 'rgba(56, 189, 248, 0.12)', // Subtle blue glow
          cyan: '#06b6d4',            // Secondary muted cyan

          // Mission domain accents (restrained, desaturated)
          moon: '#cbd5e1',            // Lunar regolith silver/slate
          'moon-muted': 'rgba(203, 213, 225, 0.12)',
          mars: '#f97316',            // Martian iron oxide ochre
          'mars-muted': 'rgba(249, 115, 22, 0.12)',
          'deep-space': '#818cf8',    // Cosmic frontier indigo
          'deep-space-muted': 'rgba(129, 140, 248, 0.12)',

          // Typography
          text: '#f8fafc',    // Soft crisp white
          muted: '#94a3b8',   // Cool neutral grey
          subtle: '#64748b',  // Low-emphasis technical grey
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          '"Fira Code"',
          '"Roboto Mono"',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(3, 7, 18, 0.5), 0 0 1px 1px rgba(56, 189, 248, 0.05)',
        'panel-hover': '0 8px 30px -4px rgba(3, 7, 18, 0.7), 0 0 1px 1px rgba(56, 189, 248, 0.15)',
        'glow-accent': '0 0 20px -4px rgba(56, 189, 248, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
