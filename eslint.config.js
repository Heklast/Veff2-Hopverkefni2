import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules/**"]
  },

  pluginJs.configs.recommended,

  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      "no-unused-vars": "warn",
      // "semi": ["error", "always"],
      // "quotes": ["error", "double"]
    }
  }
];
