import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleApiRequest } from "./server/api";

function apiPlugin(): Plugin {
  return {
    name: "cantinho-api-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith("/api")) {
          const handled = await handleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 3000,
    host: true,
  },
});
