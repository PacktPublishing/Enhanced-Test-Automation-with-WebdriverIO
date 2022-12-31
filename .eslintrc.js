module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["custom-rules"],
  rules: {
    "custom-rules/recommend-await": 2,
  },
};
