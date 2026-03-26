/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#4f6df5',
          hover: '#3d5be3',
          light: '#eef1fe',
          border: '#c5d0fa',
        },
        warm: {
          DEFAULT: '#d4a843',
          light: '#fdf6e7',
        },
        woodwind: '#2d9d78',
        brass: '#d48c2d',
        recorder: '#6b8dc9',
        success: { DEFAULT: '#22a06b', light: '#e6f9f0' },
        error: { DEFAULT: '#e5483e', light: '#fef0ef' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        'card': '14px',
      }
    },
  },
  plugins: [],
};
