import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { updatePostService } from '../../../(services)/update-post.service'
import { updatePostDTO } from '../../../(dtos)/update-post.dto'
import { verifyToken } from '@/app/lib/auth/token'

export async function PUT(req: NextRequest) 
{
  try 
  {
    const postId = req.nextUrl.pathname.split('/')[4]
    
    const getUser = await verifyToken(req)

    const getUserjson = await getUser.json() // I needed transform the response at json to get userId

    const authorId = getUserjson.userId

    const body = await req.json()
    
    if (!body || Object.keys(body).length === 0) 
    {
      return NextResponse.json(
      { message: 'Post not changed' },
      { status: 200 })
    }

    const validatedData = updatePostDTO.parse(body)
    
    const response = await updatePostService(postId, authorId, validatedData)
  
    if (!response)
    {
      return NextResponse.json(
      { message: 'Post not found' },
      { status: 404 })
    }
    else
    {
      return NextResponse.json(
      { message: 'Post updated successfully', response }, 
      { status: 200 })
    }
  } 
  catch (error) 
  {
    if (error instanceof z.ZodError)
    {
      return NextResponse.json(
      { message: 'Validation error', details: error.errors }, 
      { status: 400 })                 
    } 
    else 
    {
      console.error('\u{274C} Internal server error while updating post: ', error)
      return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 })
    }  
  }
}

