import { NextRequest, NextResponse } from "next/server"
import { createUserDTO } from "../../(dtos)/create-user.dto"
import { z } from "zod"
import { createUserService } from "../../(services)/create-user.service"
import { hashPassword } from "@/app/lib/auth/hash"

export async function POST( req: NextRequest ){
    try 
    {
        const body = await req.json()

        body.birthDate = new Date(body.birthDate)

        body.password = await hashPassword(body.password)

        const validatedData = createUserDTO.parse(body)

        const newUser = await createUserService(validatedData)

        return NextResponse.json(
            { message: 'User created successfully!', user: newUser }, 
            { status: 201 })
    } 
    catch (error) 
    {
        if (error instanceof z.ZodError)
        {
            return NextResponse.json(
                {message: 'Validation error', details: error.errors}, 
                {status: 400})                 
        } 
        else 
        {
            console.error('\u{274C} Internal server error while creating user: ', error)
            return NextResponse.json(
                {message: 'Internal server error, please try again later'},
                {status: 500})
        }  
    }
}