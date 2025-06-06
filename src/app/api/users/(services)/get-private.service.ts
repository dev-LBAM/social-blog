
import User from '@/app/lib/database/schemas/user'
import { connectToDB } from '@/app/lib/database/mongodb'
import { verifyAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'

export async function getUserPrivateService(req: NextRequest)
{
  try 
  {
    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }
    const { userId } = await auth.json()
          
    await connectToDB()

    const obtainedUserDataPrivate = await User.findById(userId)
    console.log(obtainedUserDataPrivate)
    if (!obtainedUserDataPrivate) 
    {
      return NextResponse.json(
      { message: 'User not found' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'User data private obtained successfully', user: obtainedUserDataPrivate }, 
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
