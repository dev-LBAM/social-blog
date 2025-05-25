import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifyEmailDTO } from "../(dtos)/verify-email.dto"
import { sendVerificationEmail } from "@/app/lib/utils/send-emails"
import { connectToDB } from "@/app/lib/database/mongodb"
import VerifyEmail from "@/app/lib/database/schemas/verify-email"
import User from "@/app/lib/database/schemas/user"

export async function POST(req: NextRequest) {
  try {
    console.time("totalRequest"); // Inicia o timer total da requisição
    const body = await req.json();
    const email = body.email;
    verifyEmailDTO.parse(body);

    console.time("connectToDB");
    await connectToDB();
    console.timeEnd("connectToDB");

    console.time("emailLookup");
    const emailExists = await User.findOne({ email });
    console.timeEnd("emailLookup");

    if (!emailExists) {
      console.time("codeGeneration");
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.timeEnd("codeGeneration");

      console.time("existingVerificationCheck");
      const existingVerification = await VerifyEmail.findOne({ email });
      console.timeEnd("existingVerificationCheck");
      
      if (existingVerification) {
        console.time("deleteExistingVerification");
        await VerifyEmail.deleteOne({ email });
        console.timeEnd("deleteExistingVerification");
      }
  
      console.time("saveVerification");
      const verification = new VerifyEmail({ email, code });
      await verification.save();
      console.timeEnd("saveVerification");

      console.time("sendEmail");
      sendVerificationEmail(email, code);
      console.timeEnd("sendEmail");
      
      console.timeEnd("totalRequest");
      return NextResponse.json(
        { message: 'Email code sent successfully' },
        { status: 201 }
      );
    } else {
      console.timeEnd("totalRequest");
      return NextResponse.json(
        { message: 'Email already exists...Try other!' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.timeEnd("totalRequest");
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', details: error.errors },
        { status: 400 }
      );
    } else {
      console.error('\u{274C} Internal server error while generate code to verify email: ', error);
      return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 }
      );
    }
  }
}
