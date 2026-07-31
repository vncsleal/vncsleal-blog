import { defineConfig } from "astro/config"
import { loadEnv } from "vite"
import cloudflare from "@astrojs/cloudflare"
import sanity from "@sanity/astro"

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
)

export default defineConfig({
  site: "https://vncsleal.pages.dev",
  output: "server",
  adapter: cloudflare({
    imageService: false,
    mode: "advanced",
  }),
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
    }),
  ],
})
