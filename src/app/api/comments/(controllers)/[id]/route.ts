
import { NextRequest } from 'next/server'

import { createCommentService } from '../../(services)/create.service'
export async function POST(req: NextRequest)  /* CREATE COMMENTS */
{
    const postId = req.nextUrl.pathname.split('/')[3]

    const response = await createCommentService(postId, req)
    return response
}

import { updateCommentService } from '../../(services)/update.service'
export async function PATCH(req: NextRequest)  /* UPDATE COMMENTS */
{
    const commentId = req.nextUrl.pathname.split('/')[3]

    const response = await updateCommentService(commentId, req)
    return response
}

import { getCommentService } from '../../(services)/get.service'
export async function GET(req: NextRequest)  /* GET COMMENTS */
{
    const postId = req.nextUrl.pathname.split('/')[3]
   
    const response = await getCommentService(postId, req)
    return response
}

import { deleteCommentService } from '../../(services)/delete.service'
export async function DELETE(req: NextRequest)  /* DELETE COMMENTS */
{
    const commentId = req.nextUrl.pathname.split('/')[3]

    const response = await deleteCommentService(commentId, req)
    return response
}