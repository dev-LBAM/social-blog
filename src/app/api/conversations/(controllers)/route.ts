import { NextRequest } from 'next/server'

import { getUserConversationService } from '../(services)/get.service'
export async function GET(req: NextRequest)  /* GET USER CONVERSATIONS */
{
    const response = await getUserConversationService(req)
    return response
}
