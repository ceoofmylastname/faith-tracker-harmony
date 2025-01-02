import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#800000",
          light: "#A52A2A",
          dark: "#4A0404",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#555555",
          light: "#888888",
          dark: "#333333",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#FCD34D",
          light: "#FDE68A",
          dark: "#F59E0B",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #2DFFF5 0%, #7C89FF 50%, #FF72E7 100%)',
        'maroon-gray': 'linear-gradient(135deg, #800000 0%, #555555 100%)',
        'neon-glow': 'linear-gradient(90deg, #FF1CF7 0%, #00FFE1 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        neonPulse: {
          "0%, 100%": {
            boxShadow: "0 0 5px #FF1CF7, 0 0 10px #FF1CF7, 0 0 15px #FF1CF7",
          },
          "50%": {
            boxShadow: "0 0 10px #00FFE1, 0 0 20px #00FFE1, 0 0 30px #00FFE1",
          },
        },
        borderFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        shimmer: "shimmer 2s infinite",
        neonPulse: "neonPulse 2s infinite",
        borderFlow: "borderFlow 3s ease infinite",
        scaleUp: "scaleUp 0.2s ease-out forwards",
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.light), 0 0 10px theme(colors.primary.light)',
        'neon-hover': '0 0 10px theme(colors.primary.light), 0 0 20px theme(colors.primary.light), 0 0 30px theme(colors.primary.light)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
        '3d': '3px 3px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 3px rgba(0, 0, 0, 1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 10px 10px rgba(0, 0, 0, 0.5)',
        },
        '.neon-border': {
          background: 'linear-gradient(90deg, #FF1CF7, #00FFE1, #FF1CF7)',
          backgroundSize: '200% 100%',
          animation: 'borderFlow 3s ease infinite',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;