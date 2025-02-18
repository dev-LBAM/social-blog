import { connectToDB } from '@/app/lib/database/mongodb'
import { CreatePostDTO } from '../(dtos)/create-post.dto'
import Post from '@/app/lib/database/schemas/post'


export async function createPostService(validatedData: CreatePostDTO)
{
    const newPost = new Post({
        ...validatedData
    })

    await connectToDB()
    const createdData = await newPost.save()
        console.log(createdData)
    return createdData
}
