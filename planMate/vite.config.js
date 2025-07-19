import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
    react(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버 포트
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
