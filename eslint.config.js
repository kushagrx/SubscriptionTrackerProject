import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    // Combine node and (optionally) browser globals:
    languageOptions: {
      globals: {
        ...globals.node,   // Node.js globals (includes process, __dirname, etc.)
        // ...globals.browser, // Uncomment if you want browser globals too
      },
    },
  },
]);