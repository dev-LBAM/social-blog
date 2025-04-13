import { NextRequest } from 'next/server'
import { getCommentRepliesService } from '../../../(services)/get-replies.service'

export async function GET(req: NextRequest)  /* GET COMMENTS */
{
    const commentId = req.nextUrl.pathname.split('/')[4]
    console.log(commentId)
    const response = await getCommentRepliesService(commentId, req)
    return response
}