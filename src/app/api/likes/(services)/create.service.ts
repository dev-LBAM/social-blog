import { connectToDB } from '@/app/lib/database/mongodb'
import { parseAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Post from '@/app/lib/database/schemas/post'
import Like from '@/app/lib/database/schemas/like'

export async function createLikeService(postId: string, req: NextRequest)
{

    try 
      {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        const likePost = new Like({
            postId,
            userId,
        })
    
        await connectToDB()

        const existingLike = await Like.findOne({ postId, userId })
        if (existingLike) 
        {
          return NextResponse.json(
          { message: 'User already liked this post' },
          { status: 409 })
        }

        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $inc: { likesCount: 1 } },
          { new: true })
      
        if (!updatedPost) 
        {
            return NextResponse.json(
            { message: 'Post not found' },
            { status: 404 })
        }

        const savedLike = await likePost.save()
        
        return NextResponse.json(
        { message: 'Like created successfully', like: savedLike, post: updatedPost }, 
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
          console.error('\u{274C} Internal server error while creating like: ', error)
          return NextResponse.json(
          { message: 'Internal server error, please try again later' },
          { status: 500 })
        }  
      }
}