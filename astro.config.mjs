import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  server: {
    port: 2908,
  },
  prefetch: {
    defaultStrategy: "tap",
  },
});
