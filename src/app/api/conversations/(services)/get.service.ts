import { connectToDB } from '@/app/lib/database/mongodb';
import Conversation from '@/app/lib/database/schemas/conversation';
import { parseAuth } from '@/app/lib/utils/auths';
import { NextRequest, NextResponse } from 'next/server';

export async function getUserConversationService(req: NextRequest)
{
    try 
    {
        const userId = await parseAuth(req);
        if (userId.status === 401) return userId;

        await connectToDB();

        const limit = 10;
        const cursor = req.headers.get('cursor');
        const filter = cursor ? { participants: { $all: [userId] } , _id: { $lt: cursor } } : { participants: { $all: [userId] } };

        const obtainedUserConversations = await Conversation.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .lean()

        const nextCursor = obtainedUserConversations.length > 0 ? obtainedUserConversations[obtainedUserConversations.length - 1]._id : null;

        if (!obtainedUserConversations.length) 
        {
            return NextResponse.json(
                { message: 'No user conversations found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User conversations obtained successfully', conversations: obtainedUserConversations, nextCursor }, 
            { status: 200 }
        );
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while getting user messages: ', error);
        return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 }
        );
    }
}
