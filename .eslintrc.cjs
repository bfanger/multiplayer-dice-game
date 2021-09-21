module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    extraFileExtensions: [".cjs"],
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "eslint-config-airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["only-warn"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "import/extensions": ["error", "ignorePackages", { ts: "never" }],
    "no-restricted-syntax": "off",
  },
};
