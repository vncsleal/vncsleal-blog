import { z } from "zod"

export const Home = z.object({
  pageTitle: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  announcement: z.string().optional(),
})

export type Home = z.infer<typeof Home>
