import { z } from "zod"

export const postDTO = z.object(
{
    content: z.string().min(1, "Content is required").max(1000, "Limit of 1000 characters"),
    imageUrl: z.string().url(),
}).partial()

export type PostDTO = z.infer<typeof postDTO>

