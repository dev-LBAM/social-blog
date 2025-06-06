import { connectToDB } from '@/app/lib/database/mongodb';
import Conversation from '@/app/lib/database/schemas/conversation';
import Message from '@/app/lib/database/schemas/message';
import { parseAuth } from '@/app/lib/utils/auths';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

interface Follower {
  _id: string;
  username: string;
  name: string;
  profileImg?: string;
  active: boolean;
}

interface IConversationLean {
  _id: string;
  participant: Follower;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
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
          _id: { $lt: new mongoose.Types.ObjectId(cursor) },
        }
      : {
          'participants.userId': userId,
          'participants.active': true,
        };

    // Populando userId dentro de participants para pegar username, name e profileImg
    const conversationsRaw = await Conversation.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .populate({
        path: 'participants.userId',
        select: 'username name profileImg lastSeen',
      })
      .lean();

    if (conversationsRaw.length === 0) {
      return NextResponse.json(
        { message: 'No user conversations found' },
        { status: 404 }
      );
    }

    // Interface do participante com userId populado
    interface ParticipantPopulated {
      userId: {
        _id: mongoose.Types.ObjectId;
        username: string;
        name: string;
        profileImg?: string;
        lastSeen: Date
      };
      active: boolean;
    }

    const conversations: IConversationLean[] = await Promise.all(
      conversationsRaw.map(async (conv) => {
        // Pega o participante que NÃO é o usuário logado
        const participantRaw = (conv.participants as ParticipantPopulated[]).find(
          (p) => String(p.userId._id) !== String(userId)
        );

        if (!participantRaw) {
          throw new Error('Participant not found');
        }

        // Conta mensagens não lidas para o usuário logado
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: userId,
          status: { $in: ['sent', 'delivered'] },
        });

        return {
          _id: String(conv._id),
          participant: {
            _id: String(participantRaw.userId._id),
            username: participantRaw.userId.username,
            name: participantRaw.userId.name,
            profileImg: participantRaw.userId.profileImg || '',
            lastSeen: participantRaw.userId.lastSeen,
            active: participantRaw.active,
          },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      })
    );

    const nextCursor =
      conversations.length === limit
        ? conversations[conversations.length - 1]._id
        : null;

    return NextResponse.json(
      {
        message: 'User conversations obtained successfully',
        conversations,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error getting conversations: ', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
