import Post from '@/app/lib/database/schemas/post'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auth'
import { z } from 'zod'
import { postDTO } from '../(dtos)/post.dto'

export async function updatePostService(postId: string, req: NextRequest)
{
    try 
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        const body = await req.json()
        
        if (!body || body.content.trim().length === 0 || body.imageUrl.trim().length === 0) 
        {
          return NextResponse.json(
          { message: 'Update post canceled: empty content' },
          { status: 204 })
        }
    
        const validatedData = postDTO.parse(body)
        
        await connectToDB()
        const updatedPost = await Post.findOneAndUpdate(
          {_id: postId, userId: userId},
          { $set: validatedData },
          { new: true, returnDocument: 'after' })

        if(!updatedPost)
        {
          return NextResponse.json(
          { message: 'Post not found or user not is author' },
          { status: 404 })
        }
        else
        {
          return NextResponse.json(
          { message: 'Post updated successfully', post: updatedPost }, 
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
