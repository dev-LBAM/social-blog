import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import { createCommentDTO } from '../(dtos)/create-comment.dto'
import { parseAuth } from '@/app/lib/utils/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Post from '@/app/lib/database/schemas/post'

export async function createCommentService(req: NextRequest)
{

    try 
      {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId
        
        if (!userId) 
        {
          return NextResponse.json(
          { message: 'Authentication failed' },
          { status: 401 })
        }
    
        const body = await req.json()
        console.log(body.comment)
        if (!body.comment || body.comment.trim().length === 0) 
        {
          return NextResponse.json(
          { message: 'Comment canceled: empty comment' },
          { status: 204 })
        }
    
        const validatedData = createCommentDTO.parse(body)

        const commentPost = new Comment({
            ...validatedData,
            userId,
        })
    
        await connectToDB()
        const response = await Post.findByIdAndUpdate(
          validatedData.postId,
          { $inc: { commentsCount: 1 } },
          { new: true })
      
        if (!response) 
        {
            return NextResponse.json(
            { message: 'Post not found' },
            { status: 404 })
        }

        const response2 = await commentPost.save()

        return NextResponse.json(
        { message: 'Comment created successfully', comment: response2, post: response }, 
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
          console.error('\u{274C} Internal server error while commenting post: ', error)
          return NextResponse.json(
          { message: 'Internal server error, please try again later' },
          { status: 500 })
        }  
      }
}