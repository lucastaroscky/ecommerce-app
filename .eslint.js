module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    env: {
      node: true,
      es2021: true,
      jest: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    plugins: ["@typescript-eslint"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": "warn", //
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
    ignorePatterns: ["dist/", "node_modules/"],
  };
  