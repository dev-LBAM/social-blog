import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Post from '@/app/lib/database/schemas/post'
import { commentDTO } from '../(dtos)/comment.dto'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'
import { verifyAuth } from '@/app/lib/utils/auths'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 60,
})

export async function createCommentService(postId: string, req: NextRequest) {
  try {
    const validationRequest = await checkRequest(req)
    if (validationRequest instanceof NextResponse) return validationRequest
    const { body } = validationRequest

    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }
    const { userId } = await auth.json()
  const userIp = req.headers.get("x-forwarded-for") || 'anonymous'

  try {
    await rateLimiter.consume(userIp)
  } catch {
    return NextResponse.json(
      { message: 'You have exceeded the create comment limit per minute.' },
      { status: 429 }
    )
  }
    commentDTO.parse(body)

    await connectToDB()

    let parentComment = null

    if (body.parentCommentId) 
    {
      parentComment = await Comment.findById(body.parentCommentId)
      if (!parentComment) 
      {
        return NextResponse.json({ message: 'Parent comment not found' }, { status: 404 })
      }
    }


    if (parentComment) 
    {
      await Comment.findByIdAndUpdate(body.parentCommentId, { $inc: { commentsCount: 1 } })
    } 
    else 
    {
      const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true })

      if (!updatedPost) 
      {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 })
      }
    }


    const newComment = new Comment({
      postId,
      userId,
      text: body.text ? body.text : undefined,
      file: body.fileUrl
        ? {
          name: body.fileName,
          url: body.fileUrl,
          type: checkFileType(body.fileUrl),
          isSensitive: body.isSensitive ?? undefined,
          sensitiveLabel: body.sensitiveLabel ?? undefined
        }
        : undefined,
      parentCommentId: body.parentCommentId || null,
    })

    const savedComment = await newComment.save()

    const response = NextResponse.json(
    { message: 'Comment created successfully', comment: savedComment },
    { status: 201 })

    auth.headers.forEach((value, key) => 
    {
      if (key.toLowerCase() === 'set-cookie') 
      {
        response.headers.set(key, value)
      }
    })
    
    return response
  } 
  catch (error) 
  {
    if (error instanceof z.ZodError) 
    {
      const errorMessages = error.errors.map(e => e.message)
      return NextResponse.json(
      { message: errorMessages, details: error.errors },
      { status: 400 })
    } 
    else 
    {
      console.error('\u{274C} Internal server error while creating comment: ', error)
      return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 })
    }
  }
}
