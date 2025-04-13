import bcrypt from 'bcryptjs'
import  jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import User from '../database/schemas/user'
import { connectToDB } from '../database/mongodb'


export async function createAuth(userId: string) //CREATE AUTHENTICATION
{
    try 
    {

        const accessToken = jwt.sign({ userId }, `${process.env.SECRET_TOKEN_KEY}`, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ userId }, `${process.env.SECRET_REFRESH_TOKEN_KEY}`, { expiresIn: '7d' })

        const response = NextResponse.json(
        { message: 'User logged successfully'}, 
        { status: 200 })



        response.cookies.set('accessToken', accessToken, 
        {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 300
        })
        
        response.cookies.set('refreshToken', refreshToken, 
        {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 604800
        })

        return response
    } 
    catch (error) 
    {
        console.error('Error to generate access: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' }, 
        { status: 500 })
    }
}

export async function verifyAuth(req: NextRequest) //VERIFY AUTHENTICATION
{
    const accessToken = req.cookies.get('accessToken')?.value
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!accessToken && !refreshToken) 
    {
        return NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 })
    }

    try 
    {
        const decoded = jwt.verify(accessToken!, process.env.SECRET_TOKEN_KEY!) as { userId: string }
        
        await connectToDB()
        const userExists = await User.findById(decoded.userId)
        if (!userExists)
        {
            return NextResponse.json(
            { message: 'User not found' },
            { status: 401 })
        }
    
        return NextResponse.json(
        { message: 'Authentication successfully.', userId: decoded.userId }, 
        { status: 200 })
    } 
    catch
    {
        if (!refreshToken) 
        {
            return NextResponse.json(
            { message: 'Authentication unauthorized or expired' },
            { status: 401 })
        }

        try 
        {
            const decodedRefresh = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN_KEY!) as { userId: string }
            const newAccessToken = jwt.sign({ userId: decodedRefresh.userId }, process.env.SECRET_TOKEN_KEY!, { expiresIn: '15m' })
            
            await connectToDB()
            const userExists = await User.findById(decodedRefresh.userId)
            if (!userExists)
            {
                return NextResponse.json(
                { message: 'User not found' },
                { status: 401 })
            }

            const response = NextResponse.json(
            { message: 'Authentication refresh sucessfully',  userId: decodedRefresh.userId}, 
            { status: 200 })

            response.cookies.set('accessToken', newAccessToken, 
            {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 60 * 5
            })  
            

            return response
        } 
        catch 
        {
            return NextResponse.json(
            { message: 'Authentication refresh unauthorized' }, 
            { status: 401 })
        }
    }
}

export async function parseAuth(req: NextRequest) // GET RESPONSE OF ( VERIFY AUTH ) AND TRANSFORM IN JSON
{
    const authUser = await verifyAuth(req)
    if(authUser.status === 401) return authUser
    const { userId } = await authUser.json()
    return userId
}

export async function hashPassword(password: string) // RETURN PASSWORD CRYPTOGRAPHY
{
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hashedPassword: string) // COMPARE PASSWORD CRYPTOGRAPHY WITH USER PASS
{
    return await bcrypt.compare(password, hashedPassword)
}


export async function logoutUser() // LOGOUT USER
{
    try 
    {
        const response = NextResponse.json({ message: 'Logout successful' })

        response.cookies.delete('accessToken')
        response.cookies.delete('refreshToken')

        return NextResponse.json({ message: 'Logout user successful' })
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while logout user: ', error)
        return NextResponse.json(
        { error: 'Internal server error, please try again later' },
        { status: 500 }) 
    }
}
