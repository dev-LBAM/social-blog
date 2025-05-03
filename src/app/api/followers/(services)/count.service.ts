import { connectToDB } from '@/app/lib/database/mongodb'
import Follower from '@/app/lib/database/schemas/follower'
import User from '@/app/lib/database/schemas/user'
import { NextResponse } from 'next/server'

export async function countFollowerService(clickedUserId:string, userId: string) {
    try 
    {
        await connectToDB()
        const userExists = await User.exists({ _id: clickedUserId })
        if(!userExists)
        {
            return NextResponse.json(
            { message: 'User not found' }, 
            { status: 400 })
        }
        
        const followingCount = await Follower.countDocuments({ userId: clickedUserId })
        const followersCount = await Follower.countDocuments({ followedId: clickedUserId })
        const isFollowing = await Follower.countDocuments({ userId, followedId: clickedUserId })

        return NextResponse.json(
        { following:  followingCount, followers: followersCount, isFollowing},
        { status: 200 })
        
    } 
    catch (error) 
    {
        console.error('Internal server error while creating/deleting follower:', error)
        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}
