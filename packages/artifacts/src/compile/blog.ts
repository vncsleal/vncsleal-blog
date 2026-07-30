import type { Post, Blog } from "@blog/domain"

export interface CompiledBlog {
  pageTitle: string
  seoTitle: string | null
  seoDescription: string | null
  emptyState: string | null
  posts: Post[]
}

export function compileBlog(posts: Post[], blog: Blog | null): CompiledBlog {
  return {
    pageTitle: blog?.pageTitle ?? "VNCS.",
    seoTitle: blog?.seoTitle ?? null,
    seoDescription: blog?.seoDescription ?? null,
    emptyState: blog?.emptyState ?? null,
    posts,
  }
}
