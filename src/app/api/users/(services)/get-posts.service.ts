import { connectToDB } from '@/app/lib/database/mongodb'
import Post from '@/app/lib/database/schemas/post'
import { NextRequest, NextResponse } from 'next/server'

export async function getUserPostsService(userId: string, req: NextRequest)
{
    try 
    {
        await connectToDB()

        const limit = 10

        const cursor = req.headers.get('cursor')

        const filter = cursor ? {userId: userId, _id: { $lt: cursor } } : { userId: userId }

        const obtainedUserPosts = await Post.find(filter)
        .sort({ _id: -1})
        .limit(limit)
        .lean()
        
        const nextCursor = obtainedUserPosts.length > 0 ? obtainedUserPosts[obtainedUserPosts.length - 1]._id : null
        
        if (obtainedUserPosts.length === 0 ) 
        {
            return NextResponse.json(
            { message: 'None user post found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'User posts obtained successfully', posts: obtainedUserPosts, nextCursor }, 
            { status: 200 })
        }
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while getting user posts: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}