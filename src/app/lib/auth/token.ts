import  jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'


export async function createToken(userId: string)
{
    try 
    {

        const accessToken = jwt.sign({ userId }, `${process.env.SECRET_TOKEN_KEY}`, { expiresIn: '5m' })
        const refreshToken = jwt.sign({ userId }, `${process.env.SECRET_REFRESH_TOKEN_KEY}`, { expiresIn: '7d' })

        const response = NextResponse.json({ message: 'Create auth successful' }, { status: 200 })

        response.cookies.set('accessToken', accessToken, 
        {
            httpOnly: true,
            secure: false, 
            sameSite: 'strict', 
            path: '/', 
            maxAge: 60 * 5
        })

        response.cookies.set('refreshToken', refreshToken, 
        {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })
        return response
    } 
    catch (error) 
    {
        console.error('Error generating access: ', error)
        return NextResponse.json({ error: 'Internal server error, please try again later' }, { status: 500 })
    }
}

export async function verifyToken(req: NextRequest) {
    const accessToken= req.cookies.get('accessToken')?.value as string
    const refreshToken = req.cookies.get('refreshToken')?.value as string

    try 
    {
        const decodedAccessToken = jwt.verify(accessToken, `${process.env.SECRET_TOKEN_KEY}`) as { userId: string }
        NextResponse.json({ message: 'Acquired access', userId: decodedAccessToken.userId }, { status: 200 })
        const userId = decodedAccessToken.userId
        return userId
    } 
    catch  
    {
        if (refreshToken) 
        {
            const decodedRefreshToken = jwt.verify(refreshToken, `${process.env.SECRET_REFRESH_TOKEN_KEY}`) as { userId: string }

            const newAccessToken = jwt.sign({ userId: decodedRefreshToken.userId }, `${process.env.SECRET_TOKEN_KEY}`, { expiresIn: '5m' })
            NextResponse.json(
                { message: 'Acquired access with refresh'}, 
                { status: 200 })
                .cookies.set('accessToken', newAccessToken,  
                { 
                    httpOnly: true, 
                    secure: false, 
                    sameSite: 'strict', 
                    path: '/', 
                    maxAge: 60 * 5 
                })
            const userId = decodedRefreshToken.userId
            return userId
        }
        return NextResponse.json({ error: 'Invalid or expired access and refresh access' }, { status: 401 })
    }
}

  