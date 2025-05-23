import { NextRequest, NextResponse } from 'next/server'

import { getUserConversationService } from '../(services)/get.service'
import { deleteUserConversationForSelfService } from '../(services)/deleteForYourself.service';
export async function GET(req: NextRequest)  /* GET USER CONVERSATIONS */
{
    const response = await getUserConversationService(req)
    return response
}

export async function DELETE(req: NextRequest, { params }) {
  const { conversationId } = params;

  if (!conversationId) {
    return NextResponse.json({ message: 'conversationId is required' }, { status: 400 });
  }

  return await deleteUserConversationForSelfService(conversationId, req);
}