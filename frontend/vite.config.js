import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Fix for Plotly and Node polyfills
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // ✅ Fix "global is not defined"
    "process.env": {}, // ✅ Fix "process is not defined"
  },
  resolve: {
    alias: {
      buffer: "buffer", // ✅ Fix "buffer/" resolution
    },
  },
});
