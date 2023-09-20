/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quattReg: [
          "QuattrocentoRegular",
        ],
        quattBold: ["QuattrocentoBold"],
        prozaReg: ["ProzaLibreRegular"],
        prozaItal: ["ProzaLibreItalic"],
        prozaMed: ["ProzaLibreMedium"],
        prozaSemi: [
          "ProzaLibreSemiBold",
        ],
        prozaBold: ["ProzaLibreBold"],
      },
    },
  },
  plugins: [],
};
