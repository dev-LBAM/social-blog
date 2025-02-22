import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { logoutUser, parseAuth } from '@/app/lib/utils/auth'

export async function deletePostService(req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId

        await connectToDB()
        const response = await User.findByIdAndDelete(userId)

        if (!response) 
        {
            return NextResponse.json(
            { message: 'User not found' },
            { status: 404 })
        }
        else
        {
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

