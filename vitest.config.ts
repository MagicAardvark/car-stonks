/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Using ts-expect-error to handle type conflicts between different versions of Vite
export default defineConfig({
  // @ts-expect-error - React plugin has type conflicts between Vite versions
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.{ts,tsx}", "**/*.{spec,test}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "app/__tests__/**",
        "app/tailwind.css",
        "app/entry.client.tsx",
        "app/entry.server.tsx",
        "app/root.tsx",
      ],
    },
  },
});
