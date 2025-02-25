import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { updateUserDTO } from '../(dtos)/update.dto'
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, parseAuth } from '@/app/lib/utils/auth'
import { z } from 'zod'

export async function updateUserService(req: NextRequest)
{
  try 
  {
    const userId = await parseAuth(req)
    if(userId.status === 401) return userId

    const body = await req.json()
  
    if (!body || body.trim().length === 0)
    {
      return NextResponse.json(
      { message: 'At least one field must be provided for update.' }, 
      { status: 400 })
    }
  
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

