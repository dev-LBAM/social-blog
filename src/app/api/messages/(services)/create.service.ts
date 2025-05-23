import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { messageDTO } from '../(dtos)/message.dto'
import Conversation from '@/app/lib/database/schemas/conversation'
import Message from '@/app/lib/database/schemas/message'
import { checkRequest, checkFileType } from '@/app/lib/utils/checks'
import { verifyAuth } from '@/app/lib/utils/auths'
import { Types } from 'mongoose'

export async function createMessageService(receiverId: string, req: NextRequest) {
  try {
    const validationRequest = await checkRequest(req)
    if (validationRequest instanceof NextResponse) return validationRequest
    const { body } = validationRequest

    const auth = await verifyAuth(req)
    if (auth.status === 401) return auth

    const { userId } = await auth.json()

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(receiverId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
    }

    messageDTO.parse(body)

    await connectToDB()

    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: new Types.ObjectId(userId) } },
          { $elemMatch: { userId: new Types.ObjectId(receiverId) } }
        ]
      }
    })

    const lastMessagePreview =
      (body.text ?? '') + (body.fileUrl ? ` ${checkFileType(body.fileUrl)}` : '')

    if (!conversation) {
      conversation = new Conversation({
        participants: [
          { userId: new Types.ObjectId(userId), active: true },
          { userId: new Types.ObjectId(receiverId), active: true }
        ],
        lastMessage: lastMessagePreview,
        lastMessageAt: new Date()
      })
      await conversation.save()
    } else {
      conversation.lastMessage = lastMessagePreview
      conversation.lastMessageAt = new Date()
      await conversation.save()
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: new Types.ObjectId(userId),
      receiverId: new Types.ObjectId(receiverId),
      text: body.text ?? undefined,
      file: body.fileUrl
        ? {
            url: body.fileUrl,
            type: checkFileType(body.fileUrl)
          }
        : undefined,
      status: 'sent'
    })

    const createdMessage = await newMessage.save()

    return NextResponse.json(
      {
        message: 'Message created successfully',
        conversation,
        createdMessage
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    } else {
      console.error('❌ Internal server error while creating message: ', error)
      return NextResponse.json(
        {
          message: 'Internal server error, please try again later'
        },
        { status: 500 }
      )
    }
  }
}

