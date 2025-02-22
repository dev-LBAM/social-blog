import { NextRequest } from 'next/server'

import { deleteUserService } from '../(services)/delete.service'
export async function DELETE(req: NextRequest) /* DELETE USER */
{
  const response = await deleteUserService(req)
  return response
}

import { getUserPrivateService } from '../(services)/get-private.service'
export async function GET(req: NextRequest) /* GET PRIVATE DATA OF USER */
{
  const response = await getUserPrivateService(req)
  return response
}

import { updateUserService } from '../(services)/update.service'
export async function PATCH(req: NextRequest) /* UPDATE USER */
{
  const response = await updateUserService(req)
  return response
}



