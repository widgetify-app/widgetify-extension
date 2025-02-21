
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './**/node_modules/react-tailwindcss-select/**/*/*.esm.js',
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})