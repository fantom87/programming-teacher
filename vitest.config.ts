import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["shared/src/**/*.test.ts", "server/src/**/*.test.ts"],
    // localRunner tests spawn real processes; keep them serial.
    fileParallelism: false,
  },
});
