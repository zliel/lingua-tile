import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: null, // We register manually in index.tsx
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "LinguaTile",
        short_name: "LinguaTile",
        description: "A language learning app for Japanese learners",
        theme_color: "#ffffff",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Lessons",
            short_name: "Lessons",
            description: "Go to your lessons list",
            url: "/lessons",
            icons: [
              {
                src: "android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@/": "/src/",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    reporters: ["verbose"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
      exclude: [],
    },
  },
});
