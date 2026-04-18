import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "one-dark-pro",
    },
  },
  integrations: [mdx({})],
  server: {
    port: 2908,
  },
  prefetch: {
    defaultStrategy: "tap",
  },
});
