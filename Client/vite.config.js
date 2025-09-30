import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // make sure installed
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // good practice
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
