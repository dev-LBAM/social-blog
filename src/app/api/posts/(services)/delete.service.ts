import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'

export async function deletePostService(postId: string, req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (auth.status === 401) return auth

    const { userId } = await auth.json()
    const cookies = req.headers.get('cookie')

    await connectToDB()

    const post = await Post.findOne({ _id: postId, userId })

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found or you are not the author' },
        { status: 404 }
      )
    }

    // Deleta arquivo do post (se existir)
    if (post.file?.url) {
      const url = new URL(post.file.url)
      await fetch(`http://localhost:3000/api/aws/delete-file`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(cookies ? { Cookie: cookies } : {})
        },
        body: JSON.stringify({ url })
      })
    }

    // Busca todos os comentários do post
    const comments = await Comment.find({ postId })

    // Deleta arquivos dos comentários
    await Promise.all(comments.map(async (comment) => {
      if (comment.file?.url) {
        const url = new URL(comment.file.url)
        await fetch(`http://localhost:3000/api/aws/delete-file`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(cookies ? { Cookie: cookies } : {})
          },
          body: JSON.stringify({ url })
        })
      }
    }))

    // Remove comentários e o post
    await Comment.deleteMany({ postId })
    await Post.findByIdAndDelete(postId)

    const response = NextResponse.json(
      { message: 'Post and related comments deleted successfully', userId: userId},
      { status: 200 }
    )

    auth.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        response.headers.set(key, value)
      }
    })

    return response
  } catch (error) {
    console.error('❌ Error deleting post:', error)
    return NextResponse.json(
      { message: 'Internal server error while deleting post' },
      { status: 500 }
    )
  }
}