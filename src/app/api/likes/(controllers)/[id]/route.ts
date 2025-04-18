
import { NextRequest } from 'next/server'

import { createLikeService } from '../../(services)/create.service'
export async function POST(req: NextRequest) {
    const { searchParams } = new  URL(req.url);
    const targetId =  req.nextUrl.pathname.split('/')[3];
    const targetType =  searchParams.get('type'); // Obtém o tipo da query string

    if (!targetType || (targetType !== 'Post' && targetType !== 'Comment')) {
        return new Response(JSON.stringify({ message: "Invalid targetType" }), { status: 400 });
    }

    const response = await createLikeService(targetId, targetType, req);
    return response;
}


import { getLikeService } from '../../(services)/get.service'
export async function GET(req: NextRequest)  /* GET LIKES */
{
    const postId = req.nextUrl.pathname.split('/')[3]

    const response = await getLikeService(postId, req)
    return response
}
