import { connectToDB } from '@/app/lib/database/mongodb'
import Conversation from '@/app/lib/database/schemas/conversation'
import Message from '@/app/lib/database/schemas/message'
import { verifyAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'
import mongoose, { Types } from 'mongoose'

interface FileData {
  name?: string
  url?: string
  type?: string
  isSensitive?: boolean
  sensitiveLabel?: string[]
}

interface MessageLean {
  _id: mongoose.Types.ObjectId
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  text?: string
  file?: FileData
  status: 'sent' | 'delivered' | 'viewed'
  viewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface MessageFilter {
  conversationId: mongoose.Types.ObjectId
  createdAt?: { $lt: Date }
}

export async function getUserMessagesService(friendId: string, req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.status === 401) return auth;
    
    const { userId } = await auth.json();
    await connectToDB();

    const conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: new Types.ObjectId(userId) } },
          { $elemMatch: { userId: new Types.ObjectId(friendId) } }
        ]
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "User has not started a conversation with this friend yet" },
        { status: 404 }
      );
    }

    const limit = 20;
    const cursor = req.nextUrl.searchParams.get("cursor");
    const filter: MessageFilter = { conversationId: conversation._id };

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("_id senderId text createdAt conversationId")
      .lean<MessageLean[]>();

    const nextCursor =
      messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : null;

    return NextResponse.json(
      { message: "User messages obtained successfully", messages, nextCursor },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Internal server error while getting user messages: ", error);
    return NextResponse.json(
      { message: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}