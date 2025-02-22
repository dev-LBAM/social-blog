import { connectToDB } from '@/app/lib/database/mongodb'
import Comment from '@/app/lib/database/schemas/comment'
import { createCommentDTO } from '../(dtos)/create-comment.dto'
import { parseAuth } from '@/app/lib/utils/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
        const response = await commentPost.save()
    
        return NextResponse.json(
        { message: 'Comment created successfully', comment: response }, 
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
          console.error('\u{274C} Internal server error while updating post: ', error)
          return NextResponse.json(
          { message: 'Internal server error, please try again later' },
          { status: 500 })
        }  
      }
}