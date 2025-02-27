import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { updateUserDTO } from '../(dtos)/update.dto'
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/app/lib/utils/auths'
import { z } from 'zod'
import { checkRequest } from '@/app/lib/utils/checks'

export async function updateUserService(req: NextRequest)
{
  try 
  {
    const validationRequest = await checkRequest(req)
    if(validationRequest instanceof NextResponse) return validationRequest
    const { userId, body } = validationRequest
  
    if(body.birthDate) body.birthDate = new Date(body.birthDate)
    
    if(body.password) body.password = await hashPassword(body.password)
    
    const validatedData = updateUserDTO.parse(body)
  
    await connectToDB()

    const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: validatedData },
    { new: true, returnDocument: 'after' })

    if (!updatedUser) 
    {
      return NextResponse.json(
      { message: 'User not found' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser }, 
      { status: 200 })
    }
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
      console.error('\u{274C} Internal server error while updating user: ', error)
      return NextResponse.json(
      {message: 'Internal server error, please try again later'},
      {status: 500})
    }  
  }
}

