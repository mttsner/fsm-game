import path from "path";
import react from "@vitejs/plugin-react";
import mdx from '@mdx-js/rollup'
import { defineConfig } from "vite";

export default defineConfig({
    base: "/fsm-game",
    plugins: [
        { enforce: "pre", ...mdx(/* jsxImportSource: …, otherOptions… */) },
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist/fsm-game",
    },
});
