
import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextResponse } from 'next/server'

export async function getUserPublicService(userId: string)
{
    try 
        {
        await connectToDB()
        
        const obtainedUserDataPublic = await User.findById(userId).select( "-email -password")

        if (!obtainedUserDataPublic) 
        {
            return NextResponse.json(
            { message: 'User not found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'User data public obtained successfully', user: obtainedUserDataPublic }, 
            { status: 200 })
        }
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while getting user data: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}