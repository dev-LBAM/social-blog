import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'

export async function deleteCommentService(commentId: string, req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId
    
        await connectToDB()
        const deletedComment = await Comment.findOneAndDelete(
        {
            _id: commentId,
            userId: userId, 
        })
        
        if (!deletedComment) 
        {
            return NextResponse.json(
            { message: 'Comment not found or you not is author' },
            { status: 404 })
        }
          
        const updatedPost = await Post.findByIdAndUpdate(
        deletedComment.postId,
        { $inc: { commentsCount: -1 } },
        { new: true })

        return NextResponse.json(
        { message: 'Comment deleted successfully', post: updatedPost}, 
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

