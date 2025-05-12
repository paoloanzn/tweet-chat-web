import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import path from "path";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/client"),
    },
  },
  build: {
    outDir: "./dist-client",
    manifest: true,
    rollupOptions: {
      external: ["./src/server"],
    },
  },
  plugins: [react(), tailwindcss()],
});
