import { NextRequest } from 'next/server'
import { markMessagesAsViewedService } from '../../../(services)/viewedMessage.service'
export async function PATCH(req: NextRequest) /* MARK MESSAGE AS VIEWED */
{
  const messageId = req.nextUrl.pathname.split('/')[3]
    console.log("a: ", messageId)
  const response = await markMessagesAsViewedService(messageId, req)
  return response
}
