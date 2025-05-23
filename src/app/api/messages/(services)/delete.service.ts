import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import Message from '@/app/lib/database/schemas/message'
import Conversation from '@/app/lib/database/schemas/conversation'
import { checkFileType } from '@/app/lib/utils/checks'

export async function deleteMessageService(messageId: string, req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (auth.status === 401) return auth

    const { userId } = await auth.json()

    await connectToDB()

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      senderId: userId
    })

    if (!deletedMessage) {
      return NextResponse.json(
        { message: 'Message not found or user is not the sender' },
        { status: 404 }
      )
    }

    const conversationId = deletedMessage.conversationId

    const latestMessage = await Message.findOne({ conversationId })
      .sort({ createdAt: -1 })
      .limit(1)

    if (latestMessage) {
      const newPreview =
        (latestMessage.text ?? '') +
        (latestMessage.file?.url ? ` ${checkFileType(latestMessage.file.url)}` : '')

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newPreview,
        lastMessageAt: latestMessage.createdAt
      })
    } else {
  
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: '',
        lastMessageAt: null
      })
    }

    return NextResponse.json(
      { message: 'Message deleted successfully', deletedMessage },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Internal server error while deleting message: ', error)
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    )
  }
}
