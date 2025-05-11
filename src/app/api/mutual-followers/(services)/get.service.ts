
import Redis from 'ioredis'
import Follower from '@/app/lib/database/schemas/follower'
import { NextResponse } from 'next/server'
import User from '@/app/lib/database/schemas/user'


const redis = new Redis(process.env.REDIS_URL!)


export async function getFollowerService(userId: string) {
  try {

    // IDs que o usuário segue
    const following = await Follower.find({ userId}).select('followedId')
    const followingIds = following.map(f => f.followedId.toString())

    // IDs que seguem o usuário
    const followers = await Follower.find({ followedId: userId }).select('userId')
    const followerIds = followers.map(f => f.userId.toString())

    // IDs que são mútuos
    const mutualIds = followingIds.filter(id => followerIds.includes(id))

    // Verificar quais estão online no Redis
    const onlineMutuals: string[] = []
    const offlineMutuals: string[] = []
    for (const id of mutualIds) {
      const isOnline = await redis.hget('online_users', id)
      if(isOnline) {
        onlineMutuals.push(id)
      }
      else{
        offlineMutuals.push(id)
      }
    }

    // Buscar dados dos usuários online
    const mutualUsersOnline = await User.find({ _id: { $in: onlineMutuals } })
      .select('_id name profileImg lastSeen')
      .lean()

      const mutualUsersOffline = await User.find({ _id: { $in: offlineMutuals } })
      .select('_id name profileImg lastSeen')
      .lean()

    return NextResponse.json({ usersOnline: mutualUsersOnline, usersOffline:  mutualUsersOffline})
  } catch (error) {
    {
      console.error('\u{274C} Internal server error while getting mutual followers: ', error)
      return NextResponse.json(
      {message: 'Internal server error, please try again later'},
      {status: 500})
    }  
  }
}
