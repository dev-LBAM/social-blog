import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import { parseAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Post from '@/app/lib/database/schemas/post'
import { commentDTO } from '../(dtos)/comment.dto'

export async function createCommentService(postId: string, req: NextRequest)
{
  try 
  {
    const userId = await parseAuth(req)
    if(userId.status === 401) return userId
    
    const body = await req.json()
        
    if (!body.comment && !body.fileUrl)
    {
      return NextResponse.json(
      { message: 'Create comment canceled: empty content' },
      { status: 204 })
    }

    const validatedData = commentDTO.parse(body)

    const commentPost = new Comment({
        ...validatedData,
        postId,
        userId,
    })

    await connectToDB()

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true, returnDocument: 'after' })
  
    if (!updatedPost) 
    {
        return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 })
    }

    const savedComment = await commentPost.save()

    return NextResponse.json(
    { message: 'Comment created successfully', comment: savedComment, post: updatedPost }, 
    { status: 201 })
  } 
  catch (error) 
  {
    if (error instanceof z.ZodError)
    {
      return NextResponse.json(
      { message: 'Validation failed', details: error.errors }, 
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