import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [react()],
    server: {
        proxy:
            command == "build"
                ? {}
                : {
                      "/api": {
                          target: `${import.meta.env.VITE_API_URL}`,
                      },
                  },
        host: "0.0.0.0",
    },
}));
