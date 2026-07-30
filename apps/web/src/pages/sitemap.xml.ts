import type { APIRoute } from "astro"
import { store } from "../adapters/sanity"

export const GET: APIRoute = async ({ site }) => {
  const posts = await store.getPosts()
  const base = typeof site === "string" ? new URL(site) : site!

  const entries = [
    { path: "/", priority: "1.0" },
    { path: "/blog", priority: "0.8" },
    ...posts.map((p) => ({ path: `/${p.slug}`, priority: "0.6" })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries
    .map(
      (u) => `
  <url>
    <loc>${escapeXml(new URL(u.path, base).href)}</loc>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
