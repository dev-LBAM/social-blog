import { connectToDB } from '@/app/lib/database/mongodb'
import { createPostDTO } from '../(dtos)/create.dto'
import Post from '@/app/lib/database/schemas/post'
import { NextRequest, NextResponse } from 'next/server'
import { parseAuth } from '@/app/lib/utils/auth'
import { z } from 'zod'

export async function createPostService(req: NextRequest)
{
    try
    {
        const userId = await parseAuth(req)
        if(userId.status === 401) return userId
    
        const body = await req.json()
    
        if (!body.content || body.content.trim().length === 0)
        {
            return NextResponse.json(
            { message: 'Post canceled: empty content'},
            { status: 204 })
        }

        const validatedData = createPostDTO.parse(body)
     
        const newPost = new Post({
            ...validatedData,
            userId: userId
        })
    
        await connectToDB()
        const response = await newPost.save()
    
        if(response)
        {
            return NextResponse.json(
            { message: 'Post created successfully!', post: response }, 
            { status: 201 })
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
            console.error('\u{274C} Internal server error while creating post: ', error)
            return NextResponse.json(
            {message: 'Internal server error, please try again later'},
            {status: 500})
        }  
    }
}
