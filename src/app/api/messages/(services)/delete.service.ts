import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import Message from '@/app/lib/database/schemas/message'

export async function deleteMessageService(messageId: string, req: NextRequest)
{
    try
    {
        const auth = await verifyAuth(req)
        if (auth.status === 401) 
        {
            return auth
        }
        const { userId } = await auth.json()
    
        await connectToDB()
        const deletedMessage = await Message.findOneAndDelete(
        {
            _id: messageId,
            senderId: userId, 
        })
        
        if (!deletedMessage) 
        {
            return NextResponse.json(
            { message: 'Message not found or user not is sender' },
            { status: 404 })
        }

        return NextResponse.json(
        { message: 'Message deleted successfully', deletedMessage}, 
        { status: 200 })
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting message: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

