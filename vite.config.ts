import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

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
            "@queries": path.resolve(__dirname, "./src/queries"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@stores": path.resolve(__dirname, "./src/stores"),
            "@utils": path.resolve(__dirname, "./src/utils")
        }
    }
});
