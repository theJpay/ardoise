import path from "path";

import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@components/*": path.resolve(__dirname, "./src/components/*"),
            "@entities": path.resolve(__dirname, "./src/entities"),
            "@entities/*": path.resolve(__dirname, "./src/entities/*"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@stores": path.resolve(__dirname, "./src/stores")
        }
    }
});
