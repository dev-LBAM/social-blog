import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'

export async function deleteCommentService(commentId: string, req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (auth.status === 401) return auth

    const { userId } = await auth.json()
    await connectToDB()

    // Buscar comentário com postId e parentCommentId
    const findComment = await Comment.findOne(
      { _id: commentId, userId },
      'file.url postId parentCommentId'
    )

    if (!findComment) {
      return NextResponse.json(
        { message: 'Comment not found or you are not the author' },
        { status: 404 }
      )
    }

    // Deletar arquivo na AWS, se existir
    if (findComment.file?.url) {
      const url = new URL(findComment.file.url)
      const cookies = req.headers.get('cookie')

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aws/delete-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(cookies ? { "Cookie": cookies } : {})
        },
        body: JSON.stringify({ url }),
      })
    }

    if (findComment.parentCommentId) {
      // É uma reply: decrementa commentsCount no comentário pai
     await Comment.findByIdAndUpdate(
        findComment.parentCommentId,
        { $inc: { commentsCount: -1 } },
        { new: true }
      )
    } else {
      // Comentário principal: decrementa commentsCount no post
      await Post.findByIdAndUpdate(
        findComment.postId,
        { $inc: { commentsCount: -1 } },
        { new: true }
      )
    }

    // Deleta o comentário
    await Comment.findByIdAndDelete(commentId)

    // Retornar dados atualizados para o frontend
    const response = NextResponse.json(
      {
        message: 'Comment deleted successfully',
        userId,
        postId: findComment.postId,
        parentId: findComment.parentCommentId
      },
      { status: 200 }
    )

    // Preserva cookies de autenticação
    auth.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.set(key, value)
      }
    })

    return response
  } catch (error) {
    console.error('❌ Internal server error while deleting comment: ', error)

    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    )
  }
}
