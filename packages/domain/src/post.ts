import { z } from "zod"

export const Post = z.object({
  title: z.string(),
  slug: z.string(),
  author: z.string(),
  description: z.string().optional(),
  date: z.string(),
  cover: z.string().optional(),
  body: z.any().optional(),
  topics: z.array(z.string()).optional(),
})

export type Post = z.infer<typeof Post>
