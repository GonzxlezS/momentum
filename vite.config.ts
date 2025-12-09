import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

import process from "node:process";

const basePath = process.env.VITE_BASE_PATH || "/";

// https://vite.dev/config/
export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },

      // ---
      manifest: {
        name: "Momentum",
        short_name: "Momentum",
        description:
          "Create and customize countdown cards for your important events easily and quickly.",
        lang: "en",

        display: "standalone",
        start_url: basePath,
        scope: basePath,

        theme_color: "#f3f4f6",
        background_color: "#f3f4f6",

        icons: [
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],

        screenshots: [
          {
            src: "screenshots/countdowns-wide.png",
            sizes: "2048x1536",
            type: "image/png",
            form_factor: "wide",
            label: "Countdowns list",
          },
          {
            src: "screenshots/countdowns-narrow.png",
            sizes: "1082x2402",
            type: "image/png",
            label: "Countdowns list",
          },
          {
            src: "screenshots/edit-countdowns.png",
            sizes: "1082x2402",
            type: "image/png",
            label: "Edit countdown",
          },
        ],
      },
    }),
  ],
});
