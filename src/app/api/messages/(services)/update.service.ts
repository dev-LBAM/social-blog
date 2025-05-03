import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'
import { messageDTO } from '../(dtos)/message.dto'
import Message from '@/app/lib/database/schemas/message'
import { verifyAuth } from '@/app/lib/utils/auths'


export async function updateMessageService(messageId: string, req: NextRequest)
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
        messageDTO.parse(body)
        
        await connectToDB()

        const updatedMessage = await Message.findOneAndUpdate(
        {_id: messageId, senderId: userId},
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
        { new: true })

        if(!updatedMessage)
        {
          return NextResponse.json(
          { message: 'Message not found or user not is author' },
          { status: 404 })
        }
        else
        {
          return NextResponse.json(
          { message: 'Message updated successfully', updatedMessage }, 
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
