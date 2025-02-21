import { z } from 'zod'

export const updatePostDTO = z.object(
{
    content: z.string().min(1),
    imageUrl: z.string(),
}).partial()

export type UpdatePostDTO = z.infer<typeof updatePostDTO>
