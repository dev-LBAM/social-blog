import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { loginUserDTO } from '../(dtos)/login-user.dto'
import { comparePassword, createAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function loginUserService(req: NextRequest)
{
    try 
    {
        const body = await req.json()
        
        const validatedData = loginUserDTO.parse(body)
        
        await connectToDB()
        const validatedUser = await User.findOne(
            { email: validatedData.email }
        )

        if(!validatedUser)
        {
            return NextResponse.json(
            { message: 'Email or password incorrect'  },
            { status: 404 })
        }

        const validatedPass = await comparePassword(validatedData.password, validatedUser.password)
        if(!validatedPass)
        {
            return NextResponse.json(
            { message: 'Email or password incorrect' },
            { status: 404 })
        }
        
        const response = await createAuth(validatedUser._id)

        return response 
    } 
    catch (error) 
    {
        if (error instanceof z.ZodError)
        {
            return NextResponse.json(
            { message: 'Validation error', details: error.errors }, 
            { status: 400 })                 
        } 
        else 
        {
            console.error('\u{274C} Internal server error while logging user: ', error)
            return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 })
        }  
    }
}
