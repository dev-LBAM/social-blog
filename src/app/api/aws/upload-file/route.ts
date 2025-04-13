import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
})

export async function GET(req: NextRequest) 
{
  const fileType = req.headers.get('File-Type') 
  const fileName = req.headers.get('File-Name')

  if (!fileType) 
  {
    return NextResponse.json(
    { error: 'File type unknown' }, 
    { status: 400 })
  }

  const extension = fileName?.split('.').pop()
  const baseFileName = fileName?.split('.')[0]
  
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
