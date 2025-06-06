import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { registerUserDTO } from "../(dtos)/register.dto"
import { registerUserService } from "../(services)/register.service"

export async function POST( req: NextRequest )
{
    try 
    {
        const body = await req.json()

        const validatedData = registerUserDTO.parse(body)

        const newUser = await registerUserService(validatedData)

        return NextResponse.json(
        { message: 'User registered successfully!', user: newUser }, 
        { status: 201 })
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
            console.error('\u{274C} Internal server error while registering user: ', error)

            return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 })
        }  
    }
}