import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'
import { verifyAuth } from '@/app/lib/utils/auths'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
})

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 60,
})

export async function GET(req: NextRequest) 
{
  const auth = await verifyAuth(req)
  if (auth.status === 401) 
  {
      return auth
  }

  const userIp = req.headers.get("x-forwarded-for") || 'anonymous'

  try 
  {
    await rateLimiter.consume(userIp)
  } 
  catch 
  {
    return NextResponse.json(
      { message: 'You have exceeded the file upload limit per minute. Please try again later!' }, 
      { status: 429 }
    )
  }

  const fileType = req.headers.get('File-Type') 
  const fileName = req.headers.get('File-Name')

  if (!fileType) 
  {
    return NextResponse.json(
    { error: 'File type unknown' }, 
    { status: 400 })
  }

  const lastDotIndex = fileName?.lastIndexOf('.') ?? -1
  let baseFileName = lastDotIndex !== -1 ? fileName?.substring(0, lastDotIndex) : fileName
  const extension = fileName?.substring(lastDotIndex + 1)
  
  baseFileName = baseFileName
  ?.trim()
  .toLowerCase()
  .replace(/\s+/g, '-')          
  .replace(/[^a-z0-9-_]/g, '') 
  const fileKey = `uploads/${baseFileName}-${Date.now()}.${extension}`
  
  const params = 
  {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    Expires: 60, 
    ContentType: fileType, 
  }

  try 
  {
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params)
    return NextResponse.json({ uploadUrl, fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}` })
  } 
  catch (error) 
  {

    console.error('Error generating signed URL:', error)
    return NextResponse.json({ message: 'Error generating signed URL' }, { status: 500 })
  }
}
