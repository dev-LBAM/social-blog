import { RekognitionClient, DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/utils/auths";

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (auth.status === 401) {
    return auth;
  }

  const { imageUrl } = await req.json(); 
   console.log(imageUrl)
  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
  }

  try {
    console.log('url: ', imageUrl)
    const bucket = process.env.AWS_S3_BUCKET_NAME!;
    const key = decodeURIComponent(
      imageUrl.split(`https://${bucket}.s3.amazonaws.com/`)[1]
    );
console.log('key:', key)
    const command = new DetectModerationLabelsCommand({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: key,
        },
      },
      MinConfidence: 70, // Pode ajustar
    });

    const { ModerationLabels } = await rekognition.send(command);

    const sensitiveLabels = ModerationLabels?.map((label) => label.Name) || [];

    // Lista de categorias sensíveis
    const isSensitive = sensitiveLabels.some((label) =>
      [
        "Explicit Nudity",
        "Nudity",
        "Graphic Male Nudity",
        "Graphic Female Nudity",
        "Sexual Activity",
        "Violence",
        "Graphic Violence",
        "Hate Symbols"
      ].includes(label!)
    );

    return NextResponse.json({
      isSensitive,
      labels: sensitiveLabels,
    });
  } catch (err) {
    console.error("Rekognition error:", err);
    return NextResponse.json(
      { error: "Failed to analyze image." },
      { status: 500 }
    );
  }
}
