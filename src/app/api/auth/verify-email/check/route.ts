import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectToDB } from "@/app/lib/database/mongodb"
import VerifyEmail from "@/app/lib/database/schemas/verify-email"
import { verifyEmailDTO } from "../(dtos)/verify-email.dto"


export async function POST( req: NextRequest )
{
    try 
    {
        const body = await req.json()
        await connectToDB()
        const email = body.email
        const code = body.code

        verifyEmailDTO.parse(body)

        const emailCode = await VerifyEmail.findOne({ email })
        if (!emailCode)
        {
          return NextResponse.json(
          { message: 'Incorrect or expired code' }, 
          { status: 400 })
        }         
      
        if (emailCode.code !== code)
        {
          return NextResponse.json(
          { message: 'Incorrect code' }, 
          { status: 400 })
        }
      
        if (new Date() > emailCode.expiresAt) 
        {
          await VerifyEmail.deleteOne({ email })
          return NextResponse.json(
          { message: 'Expired code' }, 
          { status: 400 })
        }
      
        await VerifyEmail.deleteOne({ email })
        return NextResponse.json(
        { message: 'Validate email sucessfully' }, 
        { status: 200 })
    
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
            console.error('\u{274C} Internal server error while check code to verify email: ', error)

            return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 })
        }  
    }
}