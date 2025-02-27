import { NextRequest } from 'next/server'

import { createMessageService } from '../../(services)/create.service'
export async function POST(req: NextRequest)  /* CREATE MESSAGES */
{
    const receiverId = req.nextUrl.pathname.split('/')[3]

    const response = await createMessageService(receiverId, req)
    return response
}

import { deleteMessageService } from '../../(services)/delete.service'
export async function DELETE(req: NextRequest)  /* DELETE MESSAGES */
{
    const messageId = req.nextUrl.pathname.split('/')[3]

    const response = await deleteMessageService(messageId, req)
    return response
}

import { updateMessageService } from '../../(services)/update.service'
export async function PATCH(req: NextRequest)  /* UPDATE MESSAGES */
{
    const messageId = req.nextUrl.pathname.split('/')[3]

    const response = await updateMessageService(messageId, req)
    return response
}