import { connectToDB } from '@/app/lib/database/mongodb'
import Like from '@/app/lib/database/schemas/like'
import { NextRequest, NextResponse } from 'next/server'

export async function getLikeService(postId: string, req: NextRequest)
{
    try 
    {
        await connectToDB()
        const limit = 10
        const cursor = req.headers.get('cursor')

        const filter = cursor ? {postId: postId, _id: { $lt: cursor } } : { postId: postId }

        const obtainedLikes = await Like.find(filter)
          .sort({ _id: -1})
          .limit(limit)
          .populate('userId', 'name profileImg')
          .lean()
        
        const nextCursor = obtainedLikes.length > 0 ? obtainedLikes[obtainedLikes.length - 1]._id : null
        
        if (obtainedLikes.length == 0) 
        {
            return NextResponse.json(
            { message: 'None like found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'Likes obtained successfully', likes: obtainedLikes, nextCursor }, 
            { status: 200 })
        }
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while getting likes: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}