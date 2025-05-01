import { connectToDB } from '@/app/lib/database/mongodb'
import { verifyAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'
import Like from '@/app/lib/database/schemas/like'

export async function createLikeService(targetId: string, targetType: "Post" | "Comment", req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (auth.status === 401) 
        {
            return auth
        }
        const { userId } = await auth.json()

        await connectToDB()

        const existingLike = await Like.findOne({ targetId, targetType, userId })

        if(existingLike) 
        {
            if (targetType === "Post") 
            {
                await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } })
            } 
            else 
            {
                await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } })
            }

            await Like.findOneAndDelete({ targetId, targetType, userId })

            const response =  NextResponse.json(
            { message: `User removed the like from this ${targetType.toLowerCase()}` },
            { status: 200 })

            auth.headers.forEach((value, key) => 
            {
                if (key.toLowerCase() === 'set-cookie') 
                {
                response.headers.set(key, value)
                }
            })
            
            return response
        }

        const like = new Like({ targetId, targetType, userId })
        await like.save()

        if (targetType === "Post") 
        {
            await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } })
        } 
        else 
        {
            await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } })
        }

        const response =  NextResponse.json(
        { message: `Like created successfully on ${targetType.toLowerCase()}`, like },
        { status: 201 })

        auth.headers.forEach((value, key) => 
        {
            if (key.toLowerCase() === 'set-cookie') 
            {
            response.headers.set(key, value)
            }
        })
        
        return response
    } 
    catch (error) 
    {
        console.error('Internal server error while creating like:', error)
        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}
