import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auths'
import Conversation from '@/app/lib/database/schemas/conversation'
import Message from '@/app/lib/database/schemas/message'
import mongoose from 'mongoose'

export async function deleteUserConversationService(conversationId: string, req: NextRequest) {
  try {
    const userAuth = await parseAuth(req)
    if (userAuth.status === 401) return userAuth

    const userId = await userAuth.json().then(data => data.userId)

    await connectToDB()

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return NextResponse.json(
        { message: 'Conversation not found or user not authorized' },
        { status: 404 }
      )
    }

    await Conversation.findByIdAndDelete(conversationId)

    await Message.deleteMany({ conversationId: new mongoose.Types.ObjectId(conversationId) })

    return NextResponse.json(
      { message: 'Conversation deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('\u{274C} Internal server error while deleting conversation: ', error)
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    )
  }
}
