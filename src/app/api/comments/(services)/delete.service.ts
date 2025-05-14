import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'

export async function deleteCommentService(commentId: string, req: NextRequest)
{
    try
    {
        const auth = await verifyAuth(req)
        if (auth.status === 401) 
        {
            return auth
        }
        const { userId } = await auth.json()
    
        await connectToDB()
        const findComment = await Comment.findOne(
        { _id: commentId, userId: userId}, 
        "file.url")
        
        if (!findComment) 
        {
            return NextResponse.json(
            { message: 'Comment not found or you not is author' },
            { status: 404 })
        }

        if (findComment.file.url) 
        {
            const url = new URL(findComment.file.url)
            const cookies = req.headers.get('cookie')
        
            await fetch(`http://localhost:3000/api/aws/delete-file`, 
            {
                method: "DELETE",
                headers: 
                { 
                    "Content-Type": "application/json",
                    ...(cookies ? { "Cookie": cookies } : {})
                },
                body: JSON.stringify({ url }),
            })
        }
          
        const updatedPost = await Post.findByIdAndUpdate(
        findComment.postId,
        { $inc: { commentsCount: -1 } },
        { new: true })

        await Comment.findByIdAndDelete(commentId)
        
        const response = NextResponse.json(
        { message: 'Comment deleted successfully', post: updatedPost}, 
        { status: 200 })

        auth.headers.forEach((value, key) => 
        {
            if (key.toLowerCase() === 'set-cookie') 
            {
                response.headers.set(key, value)
            }
        })
        
        return response 
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting comment: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

