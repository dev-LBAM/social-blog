import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auths'
import Conversation from '@/app/lib/database/schemas/conversation'
import Message from '@/app/lib/database/schemas/message'

export async function deleteUserConversationService(conversationId: string, req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId
    
        await connectToDB()

        const deletedConversation = await Conversation.findOneAndDelete(
        {
            _id: conversationId
        })
        
        if (!deletedConversation) 
        {
            return NextResponse.json(
            { message: 'Conversation not found' },
            { status: 404 })
        }

        
        await Message.deleteMany(
        {
            conversationId: deletedConversation._id
        })
          
        return NextResponse.json(
        { message: 'Conversation deleted successfully' }, 
        { status: 200 })
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting like: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

