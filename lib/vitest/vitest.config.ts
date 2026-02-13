/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./lib/vitest/vitest.setup.ts"],
    globals: true,
    include: ["lib/vitest/__test__/**/*.test.ts", "lib/vitest/__test__/**/*.test.tsx"],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});
