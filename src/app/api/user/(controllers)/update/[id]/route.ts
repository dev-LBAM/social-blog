import { updateUserDTO } from '../../../(dtos)/update-user.dto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { updateUserService } from '../../../(services)/update-user.service'
import { hashPassword } from '@/app/lib/middlewares/hash'

export async function PUT(req: NextRequest) 
{
  try 
  {
    const userId = req.nextUrl.pathname.split('/')[4]

    const body = await req.json()

    if(body.birthDate) 
    {
      body.birthDate = new Date(body.birthDate)
    }
    if(body.password) 
    {
      body.password = await hashPassword(body.password)
    }

    const validatedData = updateUserDTO.parse(body)
    
    if (Object.keys(validatedData).length === 0) 
    {
      return NextResponse.json(
        { message: 'At least one field must be provided for update.' }, 
        { status: 400 })
    }

    const response = await updateUserService(userId, validatedData)

    if (!response) 
    {
      return NextResponse.json(
          { message: 'User not found' },
          { status: 404 })
    }
    else
    {
      return NextResponse.json(
        { message: 'User updated successfully', response }, 
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

