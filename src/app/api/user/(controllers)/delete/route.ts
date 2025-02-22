
import { NextRequest, NextResponse } from 'next/server'
import { deleteUserService } from '../../(services)/delete-user.service'
import { parseAuth, verifyAuth } from '@/app/lib/utils/auth'

export async function DELETE(req: NextRequest) 
{
  try 
  {
    const userId = await parseAuth(await verifyAuth(req))

    const response = await deleteUserService(userId)

    if (!response) 
    {
      return NextResponse.json(
      { message: 'User not found' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'User deleted successfully', response }, 
      { status: 200 })
    }
  } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while deleting user: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500})
    }
}

