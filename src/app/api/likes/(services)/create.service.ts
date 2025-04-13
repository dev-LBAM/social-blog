import { connectToDB } from '@/app/lib/database/mongodb'
import { parseAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'
import Post from '@/app/lib/database/schemas/post'
import Comment from '@/app/lib/database/schemas/comment'
import Like from '@/app/lib/database/schemas/like'

export async function createLikeService(targetId: string, targetType: "Post" | "Comment", req: NextRequest) {
    try {
        const userId = await parseAuth(req)
        if (userId.status === 401) return userId

        await connectToDB()

        const existingLike = await Like.findOne({ targetId, targetType, userId })

        if (existingLike) 
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

            return NextResponse.json(
            { message: `User removed the like from this ${targetType.toLowerCase()}` },
            { status: 200 })
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

        return NextResponse.json(
        { message: `Like created successfully on ${targetType.toLowerCase()}`, like },
        { status: 201 })
    } 
    catch (error) 
    {
        console.error('Internal server error while creating like:', error)
        return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 })
    }
}
