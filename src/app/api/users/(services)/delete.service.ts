import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { logoutUser, verifyAuth } from '@/app/lib/utils/auths'
import Post from '@/app/lib/database/schemas/post'
import Message from '@/app/lib/database/schemas/message'
import Like from '@/app/lib/database/schemas/like'
import Comment from '@/app/lib/database/schemas/comment'
import Conversation from '@/app/lib/database/schemas/conversation'

export async function deleteUserService(req: NextRequest)
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
        
        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) 
        {
            return NextResponse.json(
            { message: 'User not found' },
            { status: 404 })
        }
        else
        {
            await Post.deleteMany({userId: userId})

            await Like.deleteMany({userId: userId})

            await Comment.deleteMany({userId: userId})

            await Conversation.deleteMany({participants: { $in: [userId] }})

            await Message.deleteMany(
            { 
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            })

            await logoutUser()
            return NextResponse.json(
            { message: 'User deleted successfully' }, 
            { status: 200 })
        }
    }
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting user: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

