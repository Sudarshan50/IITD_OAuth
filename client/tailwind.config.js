const withMT = require("@material-tailwind/react/utils/withMT");
const { plugin } = require("mongoose");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugin:[]
});
