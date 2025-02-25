import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auth'
import Post from '@/app/lib/database/schemas/post'
import Like from '@/app/lib/database/schemas/like'

export async function deleteLikeService(likeId: string, req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId
    
        await connectToDB()
        const deletedLike = await Like.findOneAndDelete({
            _id: likeId,
            userId: userId, 
          })
        
        if (!deletedLike) 
        {
            return NextResponse.json(
            { message: 'Like not found or user not is author' },
            { status: 404 })
        }
          
        const updatedPost = await Post.findByIdAndUpdate(
        deletedLike.postId,
        { $inc: { likesCount: -1 } },
        { new: true, returnDocument: 'after' })

        return NextResponse.json(
        { message: 'Like deleted successfully', like: deletedLike, post: updatedPost }, 
        { status: 200 })
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting like: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

