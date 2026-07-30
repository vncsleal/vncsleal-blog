import type { Post, Author } from "@blog/domain"

export interface CompiledPost {
  post: Post
  author: Author | null
}

export function compilePost(post: Post, author: Author | null): CompiledPost {
  return { post, author }
}
