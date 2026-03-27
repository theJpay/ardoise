import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@entities": path.resolve(__dirname, "./src/entities/index.ts"),
            "@entities/*": path.resolve(__dirname, "./src/entities/*"),
            "@components": path.resolve(__dirname, "./src/components/index.ts"),
            "@components/*": path.resolve(__dirname, "./src/components/*"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@stores": path.resolve(__dirname, "./src/stores")
        }
    }
});
