import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import assemblyscript from "vite-plugin-assemblyscript-asc";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    // @ts-ignore
    assemblyscript({
      projectRoot: "./",
      srcEntryFile: "src/assembly/index.ts",
      targetWasmFile: "src/assembly/build/release.wasm",
      distFolder: "src/assembly/build",
    }),
  ],
});
