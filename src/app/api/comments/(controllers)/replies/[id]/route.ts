import { NextRequest } from 'next/server'
import { getCommentRepliesService } from '../../../(services)/get-replies.service'

export async function GET(req: NextRequest)  /* GET COMMENTS REPLIES */
{
    const commentId = req.nextUrl.pathname.split('/')[4]
    const response = await getCommentRepliesService(commentId, req)
    return response
}