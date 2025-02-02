import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Web-News-Provenance/",
  resolve: {
    alias: {
      "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
    },
  },
});
