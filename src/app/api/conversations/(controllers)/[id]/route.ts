import { NextRequest } from 'next/server'
import { deleteUserConversationService } from '../../(services)/delete.service'

export async function DELETE(req: NextRequest)  /* DELETE USER CONVERSATIONS */
{
    const conversationId = req.nextUrl.pathname.split('/')[3]

    const response = await deleteUserConversationService(conversationId, req)
    return response
}