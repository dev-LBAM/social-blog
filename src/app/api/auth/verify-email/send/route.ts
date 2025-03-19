import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifyEmailDTO } from "../(dtos)/verify-email.dto"
import { sendVerificationEmail } from "@/app/lib/utils/send-emails"
import { connectToDB } from "@/app/lib/database/mongodb"
import VerifyEmail from "@/app/lib/database/schemas/verify-email"
import User from "@/app/lib/database/schemas/user"


export async function POST( req: NextRequest )
{
    try 
    {
        
        const body = await req.json()
        const email = body.email
        verifyEmailDTO.parse(body)

        await connectToDB()


        const emailExists = await User.findOne({ email })

        if(!emailExists)
        {
            const code = Math.floor(100000 + Math.random() * 900000).toString() // Gerar código de 6 dígitos
        
            const existingVerification = await VerifyEmail.findOne({ email })
            if(existingVerification) 
            {
                await VerifyEmail.deleteOne({ email })
            }
        
            const verification = new VerifyEmail({ email, code })
        
            await verification.save()
            sendVerificationEmail(email, code)
          
            return NextResponse.json(
            { message: 'Email code sended successfully!'}, 
            { status: 201 })
        }
        else
        {
            return NextResponse.json(
            { message: 'Email already exists...Try other!'}, 
            { status: 400 })
        }
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
            console.error('\u{274C} Internal server error while generate code to verify email: ', error)

            return NextResponse.json(
            { message: 'Internal server error, please try again later' },
            { status: 500 })
        }  
    }
}