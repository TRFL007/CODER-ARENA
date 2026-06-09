import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  /*
  Development proxy — routes /api/* to the local Express server.
  This means you can leave VITE_API_URL empty in development
  and all fetch(`/api/...`) calls will be forwarded automatically.

  In production, set VITE_API_URL to your deployed backend URL.
  */
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      },
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true
      }
    }
  }
});
