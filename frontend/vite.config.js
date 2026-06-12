import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  /*
  Development proxy — routes /api/* to the local Express server.
  This means you can leave VITE_API_URL empty in development
  and all fetch(`/api/...`) calls will be forwarded automatically.

  In production, set VITE_API_URL to your deployed backend URL.
  */
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true
      },
      "/socket.io": {
        target: "http://localhost:5001",
        ws: true,
        changeOrigin: true
      }
    }
  }
});
