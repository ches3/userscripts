import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: ["build/**"],
    rules: {
      "typescript/no-unnecessary-condition": "error",
      "typescript/strict-boolean-expressions": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-argument": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/no-unsafe-type-assertion": "error",
      "typescript/no-unnecessary-type-assertion": "error",
      "typescript/no-non-null-assertion": "error",
      "typescript/only-throw-error": "error",
      "typescript/no-dynamic-delete": "error",
      "typescript/no-misused-promises": "error",
      "typescript/use-unknown-in-catch-callback-variable": "error",
      "typescript/switch-exhaustiveness-check": "error",
      "typescript/no-unsafe-enum-comparison": "error",
      "typescript/restrict-plus-operands": "error",
      "typescript/prefer-nullish-coalescing": "error",
      "typescript/no-empty-object-type": "error",
      "typescript/no-confusing-void-expression": "error",
      "typescript/require-await": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ["build/**", "pnpm-lock.yaml", ".vscode/userscript.code-snippets"],
  },
  staged: {
    "*": "vp check --fix --no-error-on-unmatched-pattern",
  },
});
