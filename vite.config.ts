import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "formatjs",
            {
              idInterpolationPattern: "[sha512:contenthash:base64:6]",
              removeDefaultMessage: true,
              ast: true,
            },
          ],
        ],
      },
    }),
  ],
});
