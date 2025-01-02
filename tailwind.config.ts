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
          DEFAULT: "#800000", // Maroon
          light: "#A52A2A", // Lighter maroon
          dark: "#4A0404", // Darker maroon
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#555555", // Gray
          light: "#888888", // Light gray
          dark: "#333333", // Dark gray
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#FCD34D",
          light: "#FDE68A",
          dark: "#F59E0B",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #2DFFF5 0%, #7C89FF 50%, #FF72E7 100%)',
        'maroon-gray': 'linear-gradient(135deg, #800000 0%, #555555 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "0% 0%"
          },
          "25%": {
            "background-size": "400% 400%",
            "background-position": "100% 0%"
          },
          "50%": {
            "background-size": "400% 400%",
            "background-position": "100% 100%"
          },
          "75%": {
            "background-size": "400% 400%",
            "background-position": "0% 100%"
          }
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        flip: "flip 3s infinite linear",
        "gradient-xy": "gradient-xy 15s ease infinite",
        shimmer: "shimmer 2s infinite",
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }: { addUtilities: Function }) {
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
        '.backface-visibility-hidden': {
          'backface-visibility': 'hidden',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;