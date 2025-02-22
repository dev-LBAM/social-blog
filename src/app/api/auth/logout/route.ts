import { NextResponse } from "next/server"

export async function POST()
{
    try 
    {
        const response = NextResponse.json({ message: 'Logout successful' })

        response.cookies.delete('accessToken')
        response.cookies.delete('refreshToken')

        return response
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while logout user: ', error)
        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 }) 
    }
}
