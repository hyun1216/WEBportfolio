import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mac: {
          blue: "#007aff",
          "blue-hover": "#0062cc",
          red: "#ff5f56",
          yellow: "#ffbd2e",
          green: "#27c93f",
          folder: "#ffd15c",
        },
      },
      fontFamily: {
        mac: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Pretendard",
          '"Apple SD Gothic Neo"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;

