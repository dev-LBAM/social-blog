import { NextRequest, NextResponse } from "next/server"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { verifyAuth } from "@/app/lib/utils/auths"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (auth.status === 401) {
      return auth
    }

    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      )
    }

    const parsedUrl = new URL(url)
    const key = parsedUrl.pathname.substring(1)

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    })

    await s3.send(command)

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Error to delete file in AWS S3:", error)
    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    )
  }
}
