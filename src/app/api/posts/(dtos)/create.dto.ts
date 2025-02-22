import { z } from "zod"

export const createPostDTO = z.object(
{
    content: z.string().min(1, "Content is required").max(1000, "Limit of 1000 characters"),
    imageUrl: z.string().url().optional(),
})

export type CreatePostDTO = z.infer<typeof createPostDTO>

