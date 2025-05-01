import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Comment from '@/app/lib/database/schemas/comment'
import { commentDTO } from '../(dtos)/comment.dto'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'
import { verifyAuth } from '@/app/lib/utils/auths'


export async function updateCommentService(commentId: string, req: NextRequest)
{
  try 
  {
    const validationRequest = await checkRequest(req)
    if (validationRequest instanceof NextResponse) return validationRequest

    const { body } = validationRequest
    
    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }
    const { userId } = await auth.json()

    commentDTO.parse(body)

    const existingComment = await Comment.findOne({ _id: commentId, userId: userId })
    if (!existingComment) 
    {
      return NextResponse.json(
      { message: 'Comment not found or user not is author' },
      { status: 404 })
    }

    await connectToDB()
    const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, userId: userId },
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
    },
    { new: true })

    const response = NextResponse.json(
    { message: 'Comment updated successfully', comment: updatedComment }, 
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
      console.error('\u{274C} Internal server error while updating comment: ', error)
      return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 })
    }  
  }
}
