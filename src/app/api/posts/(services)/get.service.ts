import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import Post from '@/app/lib/database/schemas/post'

export async function getPostService(req: NextRequest)
{
    try 
    {
        await connectToDB()
        const limit = 10
        const cursor = req.headers.get('cursor') // ID do último post carregado
        
        const filter = cursor ? { _id: { $lt: cursor } } : {}
        
        const response = await Post.find(filter)
          .sort({ _id: -1 }) 
          .limit(limit)
          .lean()
        
        const nextCursor = response.length > 0 ? response[response.length - 1]._id : null
        
        if (!response) 
        {
            return NextResponse.json(
            { message: 'None post found' },
            { status: 404 })
        }
        else
        {
            return NextResponse.json(
            { message: 'Posts obtained successfully', response, nextCursor }, 
            { status: 200 })
        }
    } 
    catch (error) 
    {
        console.error('\u{274C} Internal server error while getting posts: ', error)

        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}