import { NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/app/lib/database/mongodb"
import User from "@/app/lib/database/schemas/user"


export async function POST( req: NextRequest )
{
    try 
    {
        const { username } = await req.json()
        
        connectToDB()

        const existingUser = await User.findOne({ username })

        return NextResponse.json({ available: !existingUser })
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while verify username: ', error)
        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}

