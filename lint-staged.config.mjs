/** @type {import('lint-staged').Configuration} */
const config = {
  "**/*.{ts, tsx, mjs}": ["prettier --write", "eslint --fix", "eslint"],
  "**/*.{json, css, md}": ["prettier --write"],
};

export default config;
