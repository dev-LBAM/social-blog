import { connectToDB } from '@/app/lib/database/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { parseAuth } from '@/app/lib/utils/auths';
import Message from '@/app/lib/database/schemas/message';
import mongoose from 'mongoose';

export async function markMessagesAsViewedService(conversationId: string, req: NextRequest) {
  try {
    // Verifica autenticação
    const userId = await parseAuth(req);
    if (userId.status === 401) return userId;


    await connectToDB();

    // Atualiza as mensagens que ainda não foram visualizadas pelo usuário nesta conversa
    const result = await Message.updateMany(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        receiverId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['sent', 'delivered'] },
      },
      {
        $set: {
          status: 'viewed',
          viewedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      {
        message: 'Messages marked as viewed successfully',
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('\u274C Error marking messages as viewed:', error);
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    );
  }
}
