import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Checker from "vite-plugin-checker";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: "/",
  css: {
    modules: {},
  },
  define: {
    ENABLE_FIREBASE: process.env.ENABLE_FIREBASE || true,
    PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL || "/"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(), 
    viteTsconfigPaths(), 
    Checker({ typescript: true }),
    VitePWA({
      registerType: 'autoUpdate',  // バージョンが変われば自動更新
      manifest: {                  // スマホが読むアプリ情報
        name: 'SRS Flashcards',
        short_name: 'SRS',
        start_url: '/',
        display: 'standalone',     // 住所バーを消して全画面
        background_color: '#ffffff',
        theme_color: '#1976d2',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }),
  ],
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG",
  ],
  build: {
    outDir: "dist",
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    //rollupOptions: {},
  },
});
