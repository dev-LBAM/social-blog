
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth, verifyAuth } from '@/app/lib/utils/auth'
import { getUserPrivateService } from '../../(services)/get-user-private.service'

export async function GET(req: NextRequest) 
{
  try 
  {
    const userId = await parseAuth(await verifyAuth(req))

    const response = await getUserPrivateService(userId)

    if (!response) 
    {
      return NextResponse.json(
      { message: 'User not found' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'User data obtained successfully', response }, 
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

