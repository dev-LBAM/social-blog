import { NextRequest, NextResponse } from "next/server"
import AWS from "aws-sdk"
import { verifyAuth } from "@/app/lib/utils/auths"

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export async function DELETE(req: NextRequest) {
  try 
  {
    const auth = await verifyAuth(req)
    if (auth.status === 401) 
    {
        return auth
    }
    const { url } = await req.json()

    if (!url) 
    {
      return NextResponse.json(
      { error: "File URL is required" }, 
      { status: 400 })
    }

    const parsedUrl = new URL(url)
    const key = parsedUrl.pathname.substring(1)
    const params = 
    {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    }

    await s3.deleteObject(params).promise()
    
    return NextResponse.json({ message: "File deleted succesfully" })
  } 
  catch (error) 
  {
    console.error("Error to delete file in AWS S3:", error)
    return NextResponse.json({ error: "Error to delete file, please try later" }, { status: 500 })
  }
}
