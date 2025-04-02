import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/remix/vite";
import react from "@vitejs/plugin-react";

/// <reference types="vitest" />

installGlobals();

// Separate config for Vite, without Vitest parts
export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
    react(),
  ],
});
