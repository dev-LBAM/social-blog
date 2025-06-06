import { connectToDB } from '@/app/lib/database/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import Post, { IPost } from '@/app/lib/database/schemas/post'
import Like from '@/app/lib/database/schemas/like'
import { FilterQuery } from 'mongoose'
import Follower from '@/app/lib/database/schemas/follower'
import mongoose from 'mongoose'

function isValidObjectId(id: unknown): id is string {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)
}

export async function getPostService(req: NextRequest) {
  try {
    await connectToDB()

    const limit = 10
    const cursor = req.nextUrl.searchParams.get("cursor")
    const search = req.nextUrl.searchParams.get("search") || ""
    const categoryParams = req.nextUrl.searchParams.get("categories")
    const onlyFollowers = req.nextUrl.searchParams.get('onlyFollowers') === 'true'

    const rawUserId = req.nextUrl.searchParams.get("userId")
    const userId = isValidObjectId(rawUserId) ? rawUserId : null

    const categories = categoryParams ? categoryParams.split(",") : []

    const filter: FilterQuery<IPost> = cursor
      ? { createdAt: { $lt: new Date(cursor) } }
      : {}

    if (search) {
      filter.text = { $regex: search, $options: "i" }
    }

    if (categories.length > 0) {
      filter.categories = { $in: categories }
    }

    let followingIds: string[] = []
    if (userId !== null) {
      const rows = await Follower.find({ userId }).select('followedId').lean()
      followingIds = rows.map(r => String(r.followedId))
    }

    if (onlyFollowers && userId !== null) {
      if (!followingIds.length) {
        return NextResponse.json({
          message: 'You not follow nobody',
          posts: [],
          nextCursor: null,
          followingIds,
        }, { status: 200 })
      }
      filter.userId = { $in: followingIds }
    }

    const obtainedPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name username profileImg email birthDate gender city state country createdAt')
      .lean()

    if (userId !== null) {
      const likedPosts = await Like.find({
        userId,
        targetId: { $in: obtainedPosts.map(post => String(post._id)) }
      }).lean()

      obtainedPosts.forEach((post) => {
        const postIdStr = String(post._id)
        post.hasLiked = likedPosts.some(like => String(like.targetId) === postIdStr)
      })
    }

    const nextCursor = obtainedPosts.length === limit
      ? obtainedPosts[obtainedPosts.length - 1].createdAt.toISOString()
      : null

    return NextResponse.json({
      message: 'Posts obtained successfully',
      posts: obtainedPosts,
      nextCursor,
      followingIds,
    }, { status: 200 })

  } catch (error) {
    console.error('Internal server error while getting posts: ', error)
    return NextResponse.json({ message: 'Internal server error, please try again later' }, { status: 500 })
  }
}
