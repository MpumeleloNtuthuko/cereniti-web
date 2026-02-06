import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cereniti: {
          900: "#1C1917", // Warm Charcoal (Matches the text color in logo)
          800: "#292524",
          500: "#78716C",
          100: "#F5F5F4", // Stone-ish white (Luxury paper feel)
          50:  "#FAFAF9",  // Background
        },
        // NEW: The Cereniti Gold Palette (Extracted from logo)
        gold: {
          900: "#785C18", // Deep Antique Gold
          800: "#9C7925",
          700: "#B08D37",
          600: "#C6A043", // Primary Action Gold
          500: "#D4AF37", // The Classic "Metallic" Gold
          400: "#E3C25D",
          100: "#FDF8E8", // Light wash for backgrounds
          50:  "#FFFCF5",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"], // Playfair Display matches the logo well
      },
      backgroundImage: {
        'grain': "url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')",
        // Optional: A gold gradient for buttons to look metallic
        'gold-gradient': "linear-gradient(135deg, #D4AF37 0%, #C6A043 100%)",
      }
    },
  },
  plugins: [],
};
export default config;