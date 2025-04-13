import { connectToDB } from '@/app/lib/database/mongodb'
import { postDTO } from '../(dtos)/post.dto'
import Post from '@/app/lib/database/schemas/post'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import User from '@/app/lib/database/schemas/user'
import { checkFileType, checkRequest } from '@/app/lib/utils/checks'

export async function createPostService(req: NextRequest) {
  try {
    const validationRequest = await checkRequest(req)
    if (validationRequest instanceof NextResponse) return validationRequest

    const { userId, body } = validationRequest

    const parsedBody = postDTO.parse(body)

    await connectToDB()

    const newPost = new Post({
      userId: userId,
      text: parsedBody.text || undefined,
      file: parsedBody.fileUrl
        ? {
            name: parsedBody.fileName,
            url: parsedBody.fileUrl,
            type: checkFileType(parsedBody.fileUrl),
          }
        : undefined,
      categories: parsedBody.categories ?? [],
    })

    const savedPost = await newPost.save()

    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } })

    return NextResponse.json(
      { message: 'Post created successfully', post: savedPost },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => e.message)
      return NextResponse.json(
      { message: errorMessages, details: error.errors },
      { status: 400 })
    } else {
      console.error('❌ Internal server error while creating post:', error)
      return NextResponse.json(
        { message: 'Internal server error, please try again later' },
        { status: 500 }
      )
    }
  }
}
