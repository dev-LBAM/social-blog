import  jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'


export async function createAuth(userId: string) //CREATE TOKEN
{
    try 
    {

        const accessToken = jwt.sign({ userId }, `${process.env.SECRET_TOKEN_KEY}`, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ userId }, `${process.env.SECRET_REFRESH_TOKEN_KEY}`, { expiresIn: '7d' })

        const response = NextResponse.json(
        { message: 'Create authentication successful' }, 
        { status: 200 })

        response.cookies.set('accessToken', accessToken, 
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false, 
            sameSite: 'strict', 
            path: '/', 
            maxAge: 60 * 5
        })

        response.cookies.set('refreshToken', refreshToken, 
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })
        console.log({accessToken, refreshToken})
        return response
    } 
    catch (error) 
    {
        console.error('Error generating access: ', error)

        return NextResponse.json(
        { error: 'Internal server error, please try again later' }, 
        { status: 500 })
    }
}

export async function verifyAuth(req: NextRequest) //VERIFY TOKEN
{
    const accessToken = req.cookies.get('accessToken')?.value
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!accessToken && !refreshToken) 
    {
        return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 })
    }

    try 
    {
        const decoded = jwt.verify(accessToken!, process.env.SECRET_TOKEN_KEY!) as { userId: string }
        return NextResponse.json(
        { message: 'Authentication successful', userId: decoded.userId }, 
        { status: 200 })
    } 
    catch
    {
        if (!refreshToken) 
        {
            return NextResponse.json(
            { error: 'Authentication invalid or expired' },
            { status: 401 })
        }

        try 
        {
            const decodedRefresh = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN_KEY!) as { userId: string }
            const newAccessToken = jwt.sign({ userId: decodedRefresh.userId }, process.env.SECRET_TOKEN_KEY!, { expiresIn: '15m' })

            const response = NextResponse.json(
            { message: 'Authentication refreshed',  userId: decodedRefresh.userId}, 
            { status: 200 })

            response.cookies.set('accessToken', newAccessToken, 
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 5
            })

            return response
        } 
        catch 
        {
            return NextResponse.json(
            { error: 'Invalid authentication refresh' }, 
            { status: 401 })
        }
    }
}

export async function parseAuth(data: NextResponse) //CONVERT THE VERIFY TOKEN IN JSON
{
    try 
    {
        const response = await data.json()
        return response.userId 
    } 
    catch (error) 
    {
        console.error("Error parsing auth response:", error)
        return null
    }
}
