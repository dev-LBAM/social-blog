
import { NextRequest, NextResponse } from 'next/server'

import { checkRequest } from '@/app/lib/utils/checks'
import { verifyAuth } from '@/app/lib/utils/auths'
import { createFollowerService } from '../(services)/create.service'
export async function POST(req: NextRequest) 
{

    const validationRequest = await checkRequest(req)
    if(validationRequest instanceof NextResponse) return validationRequest
    const { body } = validationRequest

    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }
    const { userId } = await auth.json()

    if(body.userFollowed)
    {
        const followedId = body.userFollowed

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
    else
    {
        return NextResponse.json(
        { message: 'User Followed is required' },
        { status: 400 })
    }
}