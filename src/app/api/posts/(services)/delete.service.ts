import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'

export async function deletePostService(postId: string, req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        await connectToDB()

        console.log(postId)
        const deletedPost = await Post.findOne(
        { _id: postId, userId }, 
        "file.url")

        if (!deletedPost) 
        {
            return NextResponse.json(
            { message: 'Post not found or user not is author' },
            { status: 404 })
        }
            if(deletedPost.file.url) 
            {
                const url = new URL(deletedPost.file.url)
                
                await fetch(`http://localhost:3000/api/aws/delete-file`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({url}),
                })
            }
            await Post.findByIdAndDelete(postId)
            return NextResponse.json(
            { message: 'Post deleted successfully', userId}, 
            { status: 200 })
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting post: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

