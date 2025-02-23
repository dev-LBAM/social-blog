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

        const response = await Post.find(filter)
          .sort({ _id: -1})
          .limit(limit)
          .lean()
        
        const nextCursor = response.length > 0 ? response[response.length - 1]._id : null
        
        if (!response) 
        {
            return NextResponse.json(
            { message: 'None comment found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'Comments obtained successfully', response, nextCursor }, 
            { status: 200 })
        }
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while getting comments: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}