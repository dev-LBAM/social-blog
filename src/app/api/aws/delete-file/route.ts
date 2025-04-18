import { NextRequest, NextResponse } from "next/server"
import AWS from "aws-sdk"

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export async function DELETE(req: NextRequest) {
  try 
  {
    const internalSecret = req.headers.get("x-internal-secret")

    if (internalSecret !== process.env.INTERNAL_SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
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
