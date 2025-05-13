import { z } from 'zod'

export const commentDTO = z.object(
{
    text: z.string().min(1, 'The comment requires at least 1 character').max(1500, 'Comment cannot exceed 1500 characters'),
    fileUrl: z.string().url(),
    fileName: z.string(),
    isSensitive: z.boolean(),
    sensitiveLabel: z.array(z.string())
}).partial()

export type CommentDTO = z.infer<typeof commentDTO>
