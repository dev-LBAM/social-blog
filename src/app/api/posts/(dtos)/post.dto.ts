
import { z } from "zod"

export const postDTO = z.object(
{
    text: z.string().min(1, "The post requires at least 1 character").max(10000, "Post cannot exceed 10000 characters"),
    fileUrl: z.string().url(),
    fileName: z.string(),
    categories: z.array(z.enum([
        "education",
        "news",
        "art",
        "tech",
        "lifestyle",
        "personal",
        "humor",
        "insights",
        "question",
      ])
    )
}).partial()

export type PostDTO = z.infer<typeof postDTO>

 