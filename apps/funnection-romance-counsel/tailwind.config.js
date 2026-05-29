const animate = require("tailwindcss-animate");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      lineHeight: {
        tightPlus: "1.35",
        middlePlus: "1.55",
        relaxedPlus: "1.75",
      },
      boxShadow: {
        "soft-card":
          "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), 0 -1px 4px rgba(0, 0, 0, 0.02)",
      },
      backgroundImage: {
        "romance-gradient":
          "linear-gradient(135deg, #FFF9F4 0%, #FFE2D4 48%, #FFD5E2 100%)",
      },
      fontFamily: {
        pretendard: ["Pretendard", "system-ui", "sans-serif"],
      },
      screens: {
        smd: "604px",
        mdl: "834px",
      },
      colors: {
        romance: {
          background: "#FFF9F4",
          surface: "#FFFDFB",
          tint: "#FFE8DD",
          blush: "#FFD5E2",
          highlight: "#D94C6A",
          accent: "#8B2248",
          ink: "#33242B",
          muted: "#795E67",
          line: "#F3B8C5",
          mint: "#E76F83",
        },
      },
    },
  },

  plugins: [animate, typography],
};

module.exports = config;
