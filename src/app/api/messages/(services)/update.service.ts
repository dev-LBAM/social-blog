import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'
import { messageDTO } from '../(dtos)/message.dto'
import Message, { IMessage } from '@/app/lib/database/schemas/message'
import Conversation, { IConversation } from '@/app/lib/database/schemas/conversation'
import { verifyAuth } from '@/app/lib/utils/auths'
import mongoose from 'mongoose'

export async function updateMessageService(messageId: string, req: NextRequest) {
  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json({ message: 'Invalid message ID' }, { status: 400 })
    }

    const validationRequest = await checkRequest(req)
    if (validationRequest instanceof NextResponse) return validationRequest

    const { body } = validationRequest

    const auth = await verifyAuth(req)
    if (auth.status === 401) {
      return auth
    }

    const { userId } = await auth.json()

    messageDTO.parse(body)

    await connectToDB()

    const updatedMessage: IMessage | null = await Message.findOneAndUpdate(
      { _id: messageId, senderId: userId },
      {
        $set: {
          text: body.text,
          file: {
            url: body.fileUrl,
            type: checkFileType(body.fileUrl),
          },
          edited: true,
        },
      },
      { new: true }
    )

    if (!updatedMessage) {
      return NextResponse.json(
        { message: 'Message not found or user not is author' },
        { status: 404 }
      )
    }

    const conversation: IConversation | null = await Conversation.findOne({
      _id: updatedMessage.conversationId,
      'lastMessage._id': updatedMessage._id,
    })

if (conversation) {
  conversation.lastMessage = String(updatedMessage._id);
  conversation.lastMessageAt = updatedMessage.updatedAt ?? new Date();
  await conversation.save();
}


    return NextResponse.json(
      { message: 'Message updated successfully', updatedMessage },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', details: error.errors },
        { status: 400 }
      )
    } else {
      console.error('\u274C Internal server error while updating message: ', error)
      return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 }
      )
    }
  }
}
