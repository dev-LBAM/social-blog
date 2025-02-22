
import { NextRequest, NextResponse } from 'next/server'
import { getUserPublicService } from '../../../(services)/get-user-public.service'

export async function GET(req: NextRequest) 
{
  try 
  {
    const userId = req.nextUrl.pathname.split('/')[4]

    const response = await getUserPublicService(userId)

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

