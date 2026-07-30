import { defineConfig } from "astro/config"
import { loadEnv } from "vite"
import vercel from "@astrojs/vercel"
import sanity from "@sanity/astro"

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
)

export default defineConfig({
  site: "https://vncsleal-blog.vercel.app",
  output: "server",
  adapter: vercel(),
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
    }),
  ],
})
