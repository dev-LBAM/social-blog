import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createPostDTO } from "../../(dtos)/create-post.dto"
import { createPostService } from "../../(services)/create-post.service"
import { verifyToken } from "@/app/lib/auth/token"


export async function POST( req: NextRequest ){
    try 
    {
        const body = await req.json()

        const response = await verifyToken(req)

        const responsejson = await response.json() // I needed transform the response at json to get userId

        body.userId = responsejson.userId

        const validatedData = createPostDTO.parse(body)
 
        const newPost = await createPostService(validatedData)

        return NextResponse.json(
        { message: 'Post created successfully!', post: newPost }, 
        { status: 201 })
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