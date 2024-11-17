module.exports = {
  extends: ['google', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
