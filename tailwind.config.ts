import plugin from "tailwindcss/plugin";
import tailwindAnimate from "tailwindcss-animate";

import type { Config } from "tailwindcss";

const animation = plugin((pluginApi) => {
  pluginApi.addUtilities({
    ".transition-5": { transition: "0.5s" },
  });
  pluginApi.matchUtilities({
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
      keyframes: {
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
        "carousel-scroll": "carousel-scroll linear infinite",
        "carousel-scroll-continuous":
          "carousel-scroll-continuous linear infinite",
        "carousel-scroll-reverse": "carousel-scroll-reverse linear infinite",
        "carousel-scroll-continuous-reverse":
          "carousel-scroll-continuous-reverse linear infinite",
      },
    },
  },
  plugins: [tailwindAnimate, animation],
} satisfies Config;

export default config;
