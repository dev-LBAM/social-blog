import { NextRequest } from "next/server"

import { updatePostService } from "../../(services)/update.service"
export async function PATCH(req: NextRequest) /* UPDATE POSTS */
{
    const postId = req.nextUrl.pathname.split('/')[3]

    const response = await updatePostService(postId, req)
    return response
}

import { deletePostService } from "../../(services)/delete.service"
export async function DELETE(req: NextRequest) /* DELETE POSTS */
{
    const postId = req.nextUrl.pathname.split('/')[3]

    const response = await deletePostService(postId, req)
    return response
}