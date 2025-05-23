import { connectToDB } from '@/app/lib/database/mongodb';
import Conversation, { IParticipant } from '@/app/lib/database/schemas/conversation';
import { parseAuth } from '@/app/lib/utils/auths';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

interface IConversationLean {
  _id: string;
  participants: IParticipant[];
  lastMessage: string;
  lastMessageAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getUserConversationService(req: NextRequest) {
  try {
    const userId = await parseAuth(req);
    if (userId.status === 401) return userId;

    await connectToDB();

    const limit = 10;
    const cursor = req.headers.get('cursor');

    const filter = cursor
      ? {
          'participants.userId': userId,
          'participants.active': true,
          _id: { $lt: new mongoose.Types.ObjectId(cursor) }
        }
      : {
          'participants.userId': userId,
          'participants.active': true
        };

    const conversationsRaw = await Conversation.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    if (conversationsRaw.length === 0) {
      return NextResponse.json(
        { message: 'No user conversations found' },
        { status: 404 }
      );
    }

    const conversations: IConversationLean[] = conversationsRaw.map((conv) => ({
      _id: String(conv._id),
      participants: conv.participants,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));

    const nextCursor =
      conversations.length === limit
        ? conversations[conversations.length - 1]._id
        : null;

    return NextResponse.json(
      {
        message: 'User conversations obtained successfully',
        conversations,
        nextCursor
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      '\u{274C} Internal server error while getting user conversations: ',
      error
    );
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    );
  }
}
