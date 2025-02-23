
import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { parseAuth } from '@/app/lib/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function getUserPrivateService(req: NextRequest)
{
  try 
  {
    const userId = await parseAuth(req)
    if(userId.status === 401) return userId
          
    await connectToDB()
    const response = await User.findById(userId)
    
    if (!response) 
    {
      return NextResponse.json(
      { message: 'User not found' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'User data obtained successfully', userData: response }, 
      { status: 200 })
    }
  } 
  catch (error) 
  {
    console.error('\u{274C} Internal server error while getting user data: ', error)
    
    return NextResponse.json(
    { message: 'Internal server error, please try again later' },
    { status: 500 })
  }
}
