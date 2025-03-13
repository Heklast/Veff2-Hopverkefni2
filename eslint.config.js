// eslint.config.js
import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  // 1) Optionally ignore certain folders (like node_modules):
  {
    ignores: ["**/node_modules/**"]
  },

  // 2) Start with the recommended config from the @eslint/js plugin:
  pluginJs.configs.recommended,

  // 3) Add/override language options + rules:
  {
    languageOptions: {
      // If you're using modern JS (ES2021+):
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        // Merge browser + node + jest globals so ESLint knows these are valid
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      // Example custom overrides:
      "no-unused-vars": "warn",
      // "semi": ["error", "always"],
      // "quotes": ["error", "double"]
    }
  }
];
