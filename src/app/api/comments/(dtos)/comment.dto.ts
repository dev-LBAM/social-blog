import { z } from 'zod'

export const commentDTO = z.object(
{
    comment: z.string().min(1, "Content is required").max(500, "Limit of 500 characters"),
    imageUrl: z.string(),
}).partial()

export type CommentDTO = z.infer<typeof commentDTO>
