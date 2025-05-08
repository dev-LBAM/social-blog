import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/utils/auths'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 60,
})

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req)
  if (auth.status === 401) {
    return auth
  }

  const userIp = req.headers.get("x-forwarded-for") || 'anonymous'

  try {
    await rateLimiter.consume(userIp)
  } catch {
    return NextResponse.json(
      { message: 'You have exceeded the file upload limit per minute. Please try again later!' },
      { status: 429 }
    )
  }

  const fileType = req.headers.get('File-Type')
  const fileName = req.headers.get('File-Name')

  if (!fileType || !fileName) {
    return NextResponse.json(
      { error: 'File type or name is missing' },
      { status: 400 }
    )
  }

  const lastDotIndex = fileName.lastIndexOf('.')
  let baseFileName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName
  const extension = fileName.substring(lastDotIndex + 1)

  baseFileName = baseFileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')         
    .replace(/[^a-z0-9-_]/g, '')

  const fileKey = `uploads/${baseFileName}-${Date.now()}.${extension}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
  })

  try {
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

    return NextResponse.json({
      uploadUrl,
      fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
    })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json(
      { message: 'Internal server error, please try again later' },
      { status: 500 }
    )
  }
}
