import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //-- This is the path you want to proxy (e.g., '/api')
      "/api": {
        target: "https://backend-4j0h.onrender.com/", //-- Backend server address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
