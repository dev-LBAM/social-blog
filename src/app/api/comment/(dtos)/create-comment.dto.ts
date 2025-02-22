import { z } from "zod"

export const createCommentDTO = z.object(
{
    postId: z.string(),
    comment: z.string().min(1).max(500, "Content is required"),
    imageUrl: z.string().url().optional(),
})

export type CreateCommentDTO = z.infer<typeof createCommentDTO>

