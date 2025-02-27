import { connectToDB } from '@/app/lib/database/mongodb';
import Conversation from '@/app/lib/database/schemas/conversation';
import Message from '@/app/lib/database/schemas/message';
import { parseAuth } from '@/app/lib/utils/auths';
import { NextRequest, NextResponse } from 'next/server';

export async function getUserMessagesService(friendId: string, req: NextRequest)
{
    try 
    {
        const userId = await parseAuth(req);
        if (userId.status === 401) return userId;

        await connectToDB();
        const conversation = await Conversation.findOne({ participants: { $all: [userId, friendId] } });

        if (!conversation) 
        {
            return NextResponse.json(
                { message: 'User has not started a conversation with this friend yet' },
                { status: 404 }
            );
        }

        const limit = 10;
        const cursor = req.headers.get('cursor');
        const filter = cursor ? { senderId: userId, _id: { $lt: cursor } } : { senderId: userId };

        const obtainedUserMessages = await Message.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const nextCursor = obtainedUserMessages.length > 0 ? obtainedUserMessages[obtainedUserMessages.length - 1]._id : null;

        if (!obtainedUserMessages.length) 
        {
            return NextResponse.json(
                { message: 'No user messages found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User messages obtained successfully', messages: obtainedUserMessages, nextCursor }, 
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
