
import { NextRequest } from 'next/server'

import { createLikeService } from '../../(services)/create.service'
export async function POST(req: NextRequest)  /* CREATE LIKES */
{
    const postId = req.nextUrl.pathname.split('/')[3]

    const response = await createLikeService(postId, req)
    return response
}

import { getLikeService } from '../../(services)/get.service'
export async function GET(req: NextRequest)  /* GET LIKES */
{
    const postId = req.nextUrl.pathname.split('/')[3]

    const response = await getLikeService(postId, req)
    return response
}

import { deleteLikeService } from '../../(services)/delete.service'
export async function DELETE(req: NextRequest)  /* DELETE LIKES */
{
    const likeId = req.nextUrl.pathname.split('/')[3]

    const response = await deleteLikeService(likeId, req)
    return response
}