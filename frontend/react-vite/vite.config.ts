import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
    },
  },
});
