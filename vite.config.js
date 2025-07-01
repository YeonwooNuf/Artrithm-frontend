import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 접근 허용
    proxy: {
      // FastAPI LLM 챗봇 기능

      "/api/artchat": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/artchat/, "/api/artchat"),
      },

      // FastAPI LLM 추천 기능
      "/api/recommend": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/recommend/, "/api/recommend"),
      },
      // 🔁 Spring Boot 백엔드

      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      // 🔁 이미지

      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
