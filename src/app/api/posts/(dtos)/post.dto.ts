
import { z } from "zod"

export const postDTO = z.object(
{
    text: z.string().min(1, "The post requires at least 1 character").max(10000, "Post cannot exceed 10000 characters"),
    fileUrl: z.string().url(),
    fileName: z.string(),
    categories: z.array(z.enum([
      "education",
      "news",
      "technology",
      "art-design",
      "humor",
      "lifestyle-wellness",
      "personal-stories",
      "music",
      "movies-tv",
      "gaming",
      "food-recipes",
      "sports",
      "health-fitness",
      "finance-investment",
      "science",
      "travel",
      "environment-nature",
      "politics-society",
      "books-literature",
      "tech-news",
      "career-jobs",
      "diy-crafts",
      "events-festivals",
      "animals-pets"
    ])),
    isSensitive: z.boolean(),
    sensitiveLabel: z.array(z.string())

}).partial()

export type PostDTO = z.infer<typeof postDTO>

 