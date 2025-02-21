import { z } from "zod"

export const createPostDTO = z.object({
    authorId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId"),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url().optional(),
})

export type CreatePostDTO = z.infer<typeof createPostDTO>

