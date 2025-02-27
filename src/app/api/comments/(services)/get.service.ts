import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import { NextRequest, NextResponse } from 'next/server'

export async function getCommentService(postId: string, req: NextRequest)
{
    try 
    {
        await connectToDB()

        const limit = 10

        const cursor = req.headers.get('cursor')

        const filter = cursor ? {postId: postId, _id: { $lt: cursor } } : { postId: postId }

        const obtainedComments = await Comment.find(filter)
          .sort({ _id: -1})
          .limit(limit)
          .populate('userId', 'name profileImg')
          .lean()
        
        const nextCursor = obtainedComments.length > 0 ? obtainedComments[obtainedComments.length - 1]._id : null
        
        if (obtainedComments.length === 0) 
        {
            return NextResponse.json(
            { message: 'None comment found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'Comments obtained successfully', comments: obtainedComments, nextCursor }, 
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