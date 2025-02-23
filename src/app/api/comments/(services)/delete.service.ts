import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auth'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'

export async function deleteCommentService(commentId: string, req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId
    
        await connectToDB()
        const response = await Comment.findOneAndDelete({
            _id: commentId,
            userId: userId, 
          })
        
        if (!response) 
        {
            return NextResponse.json(
            { message: 'Comment not found or user not is author' },
            { status: 404 })
        }
          
        const response2 = await Post.findByIdAndUpdate(
        response.postId,
        { $inc: { commentsCount: -1 } },
        { new: true, returnDocument: 'after' })

        return NextResponse.json(
        { message: 'Comment deleted successfully', comment: response, post: response2 }, 
        { status: 200 })
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting comment: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

