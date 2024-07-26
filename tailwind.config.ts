import type { Config } from "tailwindcss";
// eslint-disable-next-line import/no-extraneous-dependencies
import { fontFamily } from "tailwindcss/defaultTheme";
// eslint-disable-next-line import/no-extraneous-dependencies
import plugin from "tailwindcss/plugin";
import tailwindAnimate from "tailwindcss-animate";

const animation = plugin(({ addUtilities, matchUtilities }) => {
  addUtilities({
    ".transition-5": { transition: "0.5s" },
  });
  matchUtilities({
    "animation-delay": (value) => ({
      "animation-delay": `calc(${value}*-1)`,
    }),
    "animation-delay-halved": (value) => ({
      "animation-delay": `calc(${value}/-2)`,
    }),
    "animation-duration-carousel": (value) => ({
      "animation-duration": `${value}`,
    }),
  });
});

const config = {
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
        "carousel-scroll": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(-100%)" },
        },
        "carousel-scroll-continuous": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-200%)" },
        },
        "carousel-scroll-reverse": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "carousel-scroll-continuous-reverse": {
          from: { transform: "translateX(-200%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "carousel-scroll": "carousel-scroll linear infinite",
        "carousel-scroll-continuous":
          "carousel-scroll-continuous linear infinite",
        "carousel-scroll-reverse": "carousel-scroll-reverse linear infinite",
        "carousel-scroll-continuous-reverse":
          "carousel-scroll-continuous-reverse linear infinite",
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [tailwindAnimate, animation],
} satisfies Config;

export default config;
