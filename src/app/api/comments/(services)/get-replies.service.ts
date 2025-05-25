import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import { NextRequest, NextResponse } from 'next/server'

export async function getCommentRepliesService(commentId: string, req: NextRequest) {
  try {
    await connectToDB()

    const limit = 5
    const cursor = req.nextUrl.searchParams.get('cursor')

 
    const filter = cursor
      ? { parentCommentId: commentId, createdAt: { $lt: new Date(cursor) } }
      : { parentCommentId: commentId }

    const obtainedReplies = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate('userId', 'name profileImg username')
      .lean()

      
    let nextCursor = undefined

    if (obtainedReplies.length > limit) 
    {
      nextCursor = obtainedReplies[limit - 1].createdAt
      obtainedReplies.splice(limit)
    }

    return NextResponse.json(
    { message: 'Replies obtained successfully', replies: obtainedReplies, nextCursor },
    { status: 200 })
  } 
  catch (error) 
  {
    console.error('Internal server error while getting comments: ', error)
    return NextResponse.json(
    { message: 'Internal server error, please try again later' },
    { status: 500 })
  }
}
