import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  vite: {
    ssr: {
      noExternal: [
        "@tanstack/react-start",
        "@tanstack/start-client-core",
        "@tanstack/start-server-core",
        "@tanstack/start-fn-stubs",
      ],
    },
  },
});
