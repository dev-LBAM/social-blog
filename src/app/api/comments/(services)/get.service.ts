import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import Like from '@/app/lib/database/schemas/like'
import { NextRequest, NextResponse } from 'next/server'

export async function getCommentService(postId: string, req: NextRequest) {
  try {
    // Conectar ao banco de dados
    await connectToDB()

    const limit = 5
    const cursor = req.nextUrl.searchParams.get('cursor')
    const userId = req.nextUrl.searchParams.get("userId") 

    const filter = cursor
      ? { postId, createdAt: { $lt: new Date(cursor) },  parentCommentId: null }
      : { postId,  parentCommentId: null }


    const obtainedComments = await Comment.find(filter)
      .sort({ createdAt: -1 }) 
      .limit(limit + 1) 
      .populate('userId', 'name profileImg')
      .lean()

    // Se houver userId, busca os likes correspondentes e adiciona o campo `hasLiked`
    if (userId) {
      const likedPosts = await Like.find({
        userId,
        targetId: { $in: obtainedComments.map(comment => String(comment._id)) }
      }).lean()

      obtainedComments.forEach((comment) => {
        // Converte o post._id para string
        const commentIdStr = String(comment._id)
        comment.hasLiked = likedPosts.some(like => String(like.targetId) === commentIdStr)
      })
    }
    let nextCursor = undefined

    if (obtainedComments.length > limit) 
    {
      nextCursor = obtainedComments[limit - 1].createdAt
      obtainedComments.splice(limit)
    }

    return NextResponse.json(
    { message: 'Comments obtained successfully', comments: obtainedComments, nextCursor },
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
