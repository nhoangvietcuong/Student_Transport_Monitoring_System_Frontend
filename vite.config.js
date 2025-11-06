import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // cổng chạy frontend
    proxy: {
      "/api": {
        target: "http://localhost:5000", // backend Express của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
