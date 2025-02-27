import Post from '@/app/lib/database/schemas/post'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { postDTO } from '../(dtos)/post.dto'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'

export async function updatePostService(postId: string, req: NextRequest)
{
    try 
    {
        const validationRequest = await checkRequest(req)
        if(validationRequest instanceof NextResponse) return validationRequest
        const { userId, body } = validationRequest
    
        postDTO.parse(body)
        
        await connectToDB()

        const updatedPost = await Post.findOneAndUpdate(
        {_id: postId, userId: userId},
        { $set:
          {
              text: body.text,
              file:
              {
                  url: body.fileUrl,
                  type: checkFileType(body.fileUrl)
              },
              edited: true
          }
        },
        { new: true})

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
