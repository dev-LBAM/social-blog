import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'

export async function deletePostService(postId: string, req: NextRequest)
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
                headers: 
                { 
                    "Content-Type": "application/json" ,
                    "x-internal-secret": process.env.INTERNAL_SECRET_KEY!
                },
                body: JSON.stringify({url}),
            })
        }

        await Post.findByIdAndDelete(postId)
        const response =  NextResponse.json(
        { message: 'Post deleted successfully', userId}, 
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
        console.error('\u{274C} Internal server error while deleting post: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

