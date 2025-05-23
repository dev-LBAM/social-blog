import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import Conversation from '@/app/lib/database/schemas/conversation'
import { parseAuth } from '@/app/lib/utils/auths'

export async function deleteUserConversationForSelfService(conversationId: string, req: NextRequest) {
  try {
    const userId = await parseAuth(req)
    if (userId.status === 401) return userId

    await connectToDB()

    const updateResult = await Conversation.updateOne(
      { _id: conversationId, 'participants.userId': userId },
      { $set: { 'participants.$.active': false } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Conversation not found or user is not a participant' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Conversation deleted for user successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Internal server error while deleting user conversation for self:', error)
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    )
  }
}
