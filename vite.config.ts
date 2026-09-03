import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  build: {
    sourcemap: false,
  },
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        "https://qhvlfzahkjoixfscenru.supabase.co",
    ),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodmxmemFoa2pvaXhmc2NlbnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTU2NjAsImV4cCI6MjA5ODYzMTY2MH0.sLDvrLx5rJqN5pXwfpm7uu5DnC8kZsgidPNeA0vVpB8",
    ),
  },
});
