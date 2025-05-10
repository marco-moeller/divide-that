import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].${version}.js`,
        chunkFileNames: `[name].${version}.js`,
        assetFileNames: `[name].${version}.[ext]`
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectManifest: false,
      devOptions: {
        enabled: false
      },
      manifest: {
        name: "Divide That",
        short_name: "Divide That",
        start_url: "/",
        display: "standalone",
        background_color: "#902bb1",
        theme_color: "#902bb1",
        icons: [
          {
            src: "icon-72.png",
            sizes: "72x72",
            type: "image/png"
          },
          {
            src: "icon-96.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "icon-128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "icon-144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    react()
  ]
});
