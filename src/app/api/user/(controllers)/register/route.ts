import { NextRequest, NextResponse } from "next/server"
import { registerUserDTO } from "../../(dtos)/register-user.dto"
import { z } from "zod"
import { registerUserService } from "../../(services)/register-user.service"
import { hashPassword } from "@/app/lib/utils/hash"

export async function POST( req: NextRequest )
{
    try 
    {
        const body = await req.json()

        body.birthDate = new Date(body.birthDate)

        body.password = await hashPassword(body.password)

        const validatedData = registerUserDTO.parse(body)

        const newUser = await registerUserService(validatedData)

        return NextResponse.json(
        { message: 'User registered successfully', user: newUser }, 
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
            console.error('\u{274C} Internal server error while creating user: ', error)

            return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 })
        }  
    }
}