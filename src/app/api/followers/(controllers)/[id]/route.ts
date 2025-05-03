import { verifyAuth } from "@/app/lib/utils/auths"
import { NextRequest, NextResponse } from "next/server"
import { countFollowerService } from "../../(services)/count.service"

export async function GET(req: NextRequest) 
{
    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }

    const { userId } = await auth.json()

    const clickedUserId = req.nextUrl.pathname.split('/')[3]

    if(clickedUserId)
    {
        const response = await countFollowerService(clickedUserId, userId)
        auth.headers.forEach((value, key) => 
        {
            if (key.toLowerCase() === 'set-cookie') 
            {
                response.headers.set(key, value)
            }
        })
        return response
    }
}

import { createFollowerService } from "../../(services)/create.service"
export async function POST(req: NextRequest) 
{
    const followedId = req.nextUrl.pathname.split('/')[3]
    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }
    const { userId } = await auth.json()

    if(userId == followedId)
    {
        return NextResponse.json(
        { message: 'You cant follow yourself' },
        { status: 400 })
    }

    const response = await createFollowerService(userId, followedId)
    auth.headers.forEach((value, key) => 
    {
        if (key.toLowerCase() === 'set-cookie') 
        {
            response.headers.set(key, value)
        }
    })
    return response
}

