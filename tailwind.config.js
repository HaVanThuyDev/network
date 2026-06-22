/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0f0f0f",
        primary: "#7f5af0",
        accentCyan: "#2cb67d",
        accentPink: "#ff4d6d",
        textPrimary: "#fffffe",
        textSecondary: "#94a1b2",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        cinematic: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        'gradient-bg': 'gradientBg 15s ease infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradientBg: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        }
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(127, 90, 240, 0.5)',
        'glow-cyan': '0 0 15px rgba(44, 182, 125, 0.5)',
        'glow-pink': '0 0 15px rgba(255, 77, 109, 0.5)',
      }
    },
  },
  plugins: [],
}
