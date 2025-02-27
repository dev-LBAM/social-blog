import { z } from 'zod'

export const messageDTO = z.object(
{
    text: z.string().min(1, "The message requires at least 1 character").max(500, "Message cannot exceed 500 characters"),
    fileUrl: z.string().url(),
}).partial()

export type MessageDTO = z.infer<typeof messageDTO>
