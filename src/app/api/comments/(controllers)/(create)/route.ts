import { NextRequest} from 'next/server'

import { createCommentService } from '../../(services)/create-comment.service'
export async function POST(req: NextRequest)  /* CREATE COMMENT */
{
    const response = await createCommentService(req)
    return response
}