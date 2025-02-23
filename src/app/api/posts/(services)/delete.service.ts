import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { logoutUser, parseAuth } from '@/app/lib/utils/auth'
import Post from '@/app/lib/database/schemas/post'

export async function deletePostService(postId: string, req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        await connectToDB()
        const response = await Post.findOneAndDelete(
        {_id: postId, userId: userId})

        if (!response) 
        {
            return NextResponse.json(
            { message: 'Post not found or user not is author' },
            { status: 404 })
        }
        else
        {
            await logoutUser()
            return NextResponse.json(
            { message: 'Post deleted successfully' }, 
            { status: 200 })
        }
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting post: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

