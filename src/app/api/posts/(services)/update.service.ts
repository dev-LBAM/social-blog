import Post from '@/app/lib/database/schemas/post'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { postDTO } from '../(dtos)/post.dto'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'
import { verifyAuth } from '@/app/lib/utils/auths'

export async function updatePostService(postId: string, req: NextRequest)
{
    try 
    {
        const validationRequest = await checkRequest(req)
        if(validationRequest instanceof NextResponse) return validationRequest
        const { body } = validationRequest
    
        const auth = await verifyAuth(req)
        if (auth.status === 401) 
        {
            return auth
        }
        const { userId } = await auth.json()

        postDTO.parse(body)

        await connectToDB()
        const existingPost = await Post.findOne({ _id: postId, userId: userId })
        if (!existingPost) 
        {
          return NextResponse.json(
          { message: 'Post not found or user not is author' },
          { status: 404 })
        }

        const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, userId: userId },
        {
          $set: {
            text: body.text ? body.text : undefined,
            editAt: new Date(),
          },
          ...(body.fileUrl
            ? {
                file: {
                  url: body.fileUrl,
                  name: body.fileName || undefined,
                  type: checkFileType(body.fileUrl),
                },
              }
            : { $unset: { file: 1 } }),
            categories: body.categories ?? []
        },
        { new: true })

        const response = NextResponse.json(
        { message: 'Post updated successfully', post: updatedPost }, 
        { status: 200 })

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
          console.error('\u{274C} Internal server error while updating post: ', error)
          return NextResponse.json(
          { message: 'Internal server error, please try again later' },
          { status: 500 })
        }  
      }
}
