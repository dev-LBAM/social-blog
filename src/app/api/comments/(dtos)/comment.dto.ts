import { z } from 'zod'

export const commentDTO = z.object(
{
    comment: z.string().min(1, 'The comment requires at least 1 character').max(500, 'Comment cannot exceed 500 characters'),
    mediaUrl: z.string().url(),
}).partial()

export type CommentDTO = z.infer<typeof commentDTO>
