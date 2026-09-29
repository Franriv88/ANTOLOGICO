const tokens = require('@antologico/design-tokens/tailwind.config.js');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: tokens.theme.extend,
  },
  plugins: [],
};
