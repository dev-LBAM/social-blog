import Post from '@/app/lib/database/schemas/post'
import { connectToDB } from '@/app/lib/database/mongodb'
import { UpdatePostDTO } from '../(dtos)/update-post.dto'

export async function updatePostService(postId: string, authorId: string, validatedData: UpdatePostDTO)
{
    await connectToDB()
    const updatedData = await Post.findOneAndUpdate(
        {_id: postId, authorId: authorId},
        { $set: validatedData },
        { new: true, returnDocument: 'after' }
    )

    return updatedData
}
