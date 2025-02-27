import { z } from "zod"

export const postDTO = z.object(
{
    text: z.string().min(1, "The post requires at least 1 character").max(1000, "Post cannot exceed 1000 characters"),
    fileUrl: z.string().url(),
}).partial()

export type PostDTO = z.infer<typeof postDTO>

