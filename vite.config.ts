import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // <- Ajoute cette ligne pour tester en local
      },
      workbox: {
        globPatterns: ["**/*.{js,css,png,ico,html,svg,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/milesto-backend.vercel.app\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "Milesto",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "css-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "script",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "js-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
      },
      manifest: {
        name: "Milesto",
        short_name: "Milesto",
        description: "The best way to track your miles",
        theme_color: "#A8DCE7",
        background_color: "#101422",
        display: "standalone",
        icons: [
          {
            src: "/192logo1.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/512logo1.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/512logo1.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenBureau.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenMobile.png",
            sizes: "720x1280",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
  },
});
