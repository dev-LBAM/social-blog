import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auth'
import { z } from 'zod'
import Comment from '@/app/lib/database/schemas/comment'
import { commentDTO } from '../(dtos)/comment.dto'


export async function updateCommentService(commentId: string, req: NextRequest)
{
    try 
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        const body = await req.json()
        
        if (!body || body.comment.trim().length === 0 && body.imageUrl.trim().length === 0) 
        {
          return NextResponse.json(
          { message: 'Update comment canceled: empty content' },
          { status: 204 })
        }
    
        const validatedData = commentDTO.parse(body)
        
        await connectToDB()
        const updatedComment = await Comment.findOneAndUpdate(
            {_id: commentId, userId: userId},
            { $set: validatedData },
            { new: true, returnDocument: 'after' },
        )

        if(!updatedComment)
        {
          return NextResponse.json(
          { message: 'Comment not found or user not is author' },
          { status: 404 })
        }
        else
        {
          return NextResponse.json(
          { message: 'Comment updated successfully', comment: updatedComment }, 
          { status: 200 })
        }
      } 
      catch (error) 
      {
        if (error instanceof z.ZodError)
        {
          return NextResponse.json(
          { message: 'Validation error', details: error.errors }, 
          { status: 400 })                 
        } 
        else 
        {
          console.error('\u{274C} Internal server error while updating comment: ', error)
          return NextResponse.json(
          { message: 'Internal server error, please try again later' },
          { status: 500 })
        }  
      }
}
