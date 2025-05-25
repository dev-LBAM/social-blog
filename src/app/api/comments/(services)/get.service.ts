import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import Like from '@/app/lib/database/schemas/like'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

function isValidObjectId(id: unknown): id is string {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)
}

export async function getCommentService(postId: string, req: NextRequest) {
  try {
    await connectToDB()

    const limit = 5
    const cursor = req.nextUrl.searchParams.get('cursor')
    const rawUserId = req.nextUrl.searchParams.get("userId")
    const userId = isValidObjectId(rawUserId) ? rawUserId : null

    const filter = cursor
      ? { postId, createdAt: { $lt: new Date(cursor) }, parentCommentId: null }
      : { postId, parentCommentId: null }

    const obtainedComments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate('userId', 'name username profileImg')
      .lean()

    if (userId) {
      const likedComments = await Like.find({
        userId,
        targetId: { $in: obtainedComments.map(comment => String(comment._id)) }
      }).lean()

      obtainedComments.forEach((comment) => {
        const commentIdStr = String(comment._id)
        comment.hasLiked = likedComments.some(like => String(like.targetId) === commentIdStr)
      })
    }

    let nextCursor: string | undefined = undefined
    if (obtainedComments.length > limit) {
      nextCursor = obtainedComments[limit - 1].createdAt.toISOString()
      obtainedComments.splice(limit)
    }

    return NextResponse.json(
      {
        message: 'Comments obtained successfully',
        comments: obtainedComments,
        nextCursor,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Internal server error while getting comments: ', error)
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    )
  }
}
