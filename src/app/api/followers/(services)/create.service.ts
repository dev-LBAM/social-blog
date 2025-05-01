import { connectToDB } from '@/app/lib/database/mongodb'
import Follower from '@/app/lib/database/schemas/follower'
import User from '@/app/lib/database/schemas/user'
import { NextResponse } from 'next/server'

export async function createFollowerService(userId: string, followedId: string) {
    try 
    {
        await connectToDB()

        const existingUser = await User.findOne({ userId: followedId})
        if(!existingUser) 
        {
            const response =  NextResponse.json(
            { message: `Followed user not found` },
            { status: 400 })

            return response
        }

        const existingFollower = await Follower.findOne({ userId, followedId })
        if(existingFollower) 
        {
            await Follower.findOneAndDelete({ userId, followedId})

            const response =  NextResponse.json(
            { message: `User unfollowed` },
            { status: 200 })

            return response
        }

        const follower = new Follower({ userId, followedId })
        await follower.save()

        const response =  NextResponse.json(
        { message: `User followed succesfully`, follower },
        { status: 201 })

        return response
    } 
    catch (error) 
    {
        console.error('Internal server error while creating/deleting follower:', error)
        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}
