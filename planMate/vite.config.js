import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

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
        target: "https://pmserver.salmakis.online", // 백엔드 서버 포트
        // target: "http://localhost:8080"
        changeOrigin: true,
        secure: false,
      },
    },
    host: 'localhost',
    port: 5173
  },
});
