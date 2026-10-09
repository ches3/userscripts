import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: ["build/**"],
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
