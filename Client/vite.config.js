import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Load env variables
export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // or "0.0.0.0"
    port: 5173,
    proxy: {
      "/images": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
      },
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
  define: {
    // Expose VITE_API_URL to client code
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
}));
