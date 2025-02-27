import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { messageDTO } from '../(dtos)/message.dto'
import Conversation from '@/app/lib/database/schemas/conversation'
import Message from '@/app/lib/database/schemas/message'
import { checkRequest, checkFileType } from '@/app/lib/utils/checks'

export async function createMessageService(receiverId: string, req: NextRequest) 
{
  try 
  {
    const validationRequest = await checkRequest(req)
    if(validationRequest instanceof NextResponse) return validationRequest
    const { userId, body } = validationRequest

    messageDTO.parse(body)

    await connectToDB()

    let conversation = await Conversation.findOne({participants: { $all: [userId, receiverId] }})

    if (!conversation) 
    {
      conversation = new Conversation(
      {
        lastMessage: (body.text ? body.text : '') + (body.fileUrl? `${checkFileType(body.fileUrl)}`: ''),
        lastMessageAt: new Date(),
        participants: [userId, receiverId]
      })
      await conversation.save()
    } 
    else
    {
      conversation.lastMessage = (body.text ? body.text : '') + (body.fileUrl ? `${checkFileType(body.fileUrl)}`: '')
      conversation.lastMessageAt = new Date()
      await conversation.save()
    }

    const newMessage = new Message(
    {
      conversationId: conversation._id,
      senderId: userId,
      receiverId,
      text: body.text ? body.text : undefined,
      file: body.fileUrl ?
      {
          url: body.fileUrl,
          type: checkFileType(body.fileUrl),
      } : undefined
    })

    const createdMessage = await newMessage.save()

    return NextResponse.json(
    { message: 'Message created successfully', conversation, createdMessage },
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
      console.error('\u{274C} Internal server error while creating message: ', error)
      return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 })
    }
  }
}
