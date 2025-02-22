import Post from '@/app/lib/database/schemas/post'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auth'
import { updatePostDTO } from '../(dtos)/update.dto'
import { z } from 'zod'

export async function updatePostService(req: NextRequest)
{
    try 
    {
        const postId = req.nextUrl.pathname.split('/')[3]
    
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        const body = await req.json()
        
        if (!body || body.content.trim().length === 0|| body.imageUrl.trim().length === 0) 
        {
          return NextResponse.json(
          { message: 'Post canceled: empty content' },
          { status: 204 })
        }
    
        const validatedData = updatePostDTO.parse(body)
        
        await connectToDB()
        const response = await Post.findOneAndUpdate(
            {_id: postId, userId: userId},
            { $set: validatedData },
            { new: true, returnDocument: 'after' },
        )

        if(!response)
        {
          return NextResponse.json(
          { message: 'Post not found or user not is author' },
          { status: 404 })
        }
        else
        {
          return NextResponse.json(
          { message: 'Post updated successfully', response }, 
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
          console.error('\u{274C} Internal server error while updating post: ', error)
          return NextResponse.json(
          { message: 'Internal server error, please try again later' },
          { status: 500 })
        }  
      }
}
