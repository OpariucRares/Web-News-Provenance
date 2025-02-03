import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { exec } from "child_process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      plugins: [
        {
          name: "copy-cname",
          closeBundle: () => {
            exec("cp CNAME dist/CNAME", (err) => {
              if (err) {
                console.error("Error copying CNAME file:", err);
              } else {
                console.log("CNAME file copied to dist directory");
              }
            });
          },
        },
      ],
    },
  },
});
