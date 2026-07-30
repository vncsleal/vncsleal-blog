import type { SanityClient } from "@sanity/client"
import { z } from "zod"
import { Author, Post, Topic, Home, Blog } from "@blog/domain"
import type { ContentStore } from "@blog/domain"

function stripNulls<T>(value: T): T {
  if (value === null) return undefined as T
  if (Array.isArray(value)) return value.map(stripNulls) as T
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, stripNulls(v)])
    ) as T
  }
  return value
}

function parseDoc<T>(schema: z.ZodSchema<T>, data: unknown, source: string): T {
  const result = schema.safeParse(stripNulls(data))
  if (!result.success) {
    throw new Error(`Schema validation failed for ${source}: ${result.error.message}`)
  }
  return result.data
}

const authorQuery = `*[_type == "author" && defined(slug.current)][0]{
  name,
  "slug": slug.current,
  email,
  tagline,
  location,
  bio,
  "body": body[]{
    _key,
    _type,
    style,
    markDefs[]{
      _key,
      _type,
      href
    },
    "url": asset->url,
    children[]{
      _key,
      _type,
      text,
      marks
    }
  },
  "photo": photo.asset->url,
  "social": coalesce(social[]{platform, url}, [])
}`

const postsQuery = `*[_type == "post" && defined(slug.current)] | order(date desc){
  "slug": slug.current,
  title,
  "author": author->slug.current,
  description,
  date,
  "cover": cover.asset->url,
  "topics": topics[]->slug.current
}`

const postQuery = `*[_type == "post" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  "author": author->slug.current,
  description,
  date,
  "cover": cover.asset->url,
  "body": body[]{
    _key,
    _type,
    style,
    markDefs[]{
      _key,
      _type,
      href
    },
    "url": asset->url,
    children[]{
      _key,
      _type,
      text,
      marks
    }
  },
  "topics": topics[]->slug.current
}`

const topicsQuery = `*[_type == "topic" && defined(slug.current)] | order(title){
  "slug": slug.current,
  title,
  description
}`

export function createStore(client: SanityClient): ContentStore {
  return {
    async getAuthor() {
      const data = await client.fetch(authorQuery)
      if (!data) return null
      const social = (data.social ?? []).reduce(
        (acc: Record<string, string>, s: { platform: string; url: string }) => {
          if (s.platform && s.url) acc[s.platform] = s.url
          return acc
        },
        {}
      )
      return parseDoc(Author, { ...data, social }, "author")
    },

    async getPosts() {
      const data = await client.fetch(postsQuery)
      return parseDoc(Post.array(), data, "posts")
    },

    async getPost(slug: string) {
      const data = await client.fetch(postQuery, { slug })
      if (!data) return null
      return parseDoc(Post, data, `post:${slug}`)
    },

    async getTopics() {
      const data = await client.fetch(topicsQuery)
      return parseDoc(Topic.array(), data, "topics")
    },

    async getHome() {
      const data = await client.fetch(`*[_type == "home"][0]{
        pageTitle,
        seoTitle,
        seoDescription,
        announcement
      }`)
      if (!data) return null
      return parseDoc(Home, data, "home")
    },

    async getBlog() {
      const data = await client.fetch(`*[_type == "blog"][0]{
        pageTitle,
        seoTitle,
        seoDescription,
        emptyState
      }`)
      if (!data) return null
      return parseDoc(Blog, data, "blog")
    },
  }
}
