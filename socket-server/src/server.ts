import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { connectToDB } from './db/mongodb'
import User from './db/schemas/user'
import Redis from 'ioredis'

dotenv.config()
const app = express()
app.use(cookieParser())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

const redis = new Redis(process.env.REDIS_URL!)

//Extension of type to userId
declare module 'socket.io'
{
  interface Socket 
  {
    userId: string
    name: string
    profileImg: string
  }
}


const verifyAuthForSocket = (cookieHeader: string): { userId: string } | null => 
{
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [name, ...rest] = cookie.trim().split('=')
      return [name, rest.join('=')]
    })
  )

  const refreshToken = cookies.refreshToken
  if(!refreshToken) return null

  const decoded = jwt.verify(refreshToken, process.env.SECRET_TOKEN_KEY!) as { userId: string }
  return decoded
}


// Middleware socket
io.use(async (socket: Socket, next) => 
{
  await connectToDB()
  const cookieHeader = socket.handshake.headers.cookie

  if(!cookieHeader) return next(new Error('Not authenticated'))

  const decoded = verifyAuthForSocket(cookieHeader)
  if(!decoded) return next(new Error('Invalid token'))

  const user = await User.findById(decoded.userId).select('name profileImg userId')
  if(!user) return next(new Error('User not found'))

  socket.userId = decoded.userId
  socket.name = user.name
  socket.profileImg = user.profileImg

  next()
})


io.on('connection', async (socket: Socket) => 
{

  console.log(`🟢 ${socket.userId} connected with socket ${socket.id}`)

  // Save in redis the connection user
  await redis.hset('online_users', socket.userId, socket.id)

  // Send the list updated of online users
  redis.hkeys('online_users').then(userIds => 
  {
    io.emit('online_users', userIds)
  })

  // Send userid
  socket.emit('set_userid', socket.userId)

  // Send user name
  socket.emit('set_username', socket.name)


  // When user send an private message
  socket.on('private_message', ({ message }) => 
  {

    io.emit('private_message', 
    {
      from: socket.name,
      message,
      profileImg: socket.profileImg
    })

  })

  // When user disconnect
  socket.on('disconnect', async () => 
  {
    console.log(`🔴 ${socket.name} desconnected`)
    await redis.hdel('online_users', socket.userId)

    // Send the list updated after disconnect
    redis.hkeys('online_users').then(userIds => 
    {
      io.emit('online_users', userIds)
    })
  })
})

server.listen(3001, () => {
  console.log('Servidor WebSocket rodando em http://localhost:3001')
})
