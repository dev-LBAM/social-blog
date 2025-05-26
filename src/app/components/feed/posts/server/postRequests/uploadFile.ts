import { convertToAcceptedImage } from "@/app/lib/utils/convertFile"

export default async function uploadFile(originalFile: File) {

  const file = await convertToAcceptedImage(originalFile)
  const signedUrlFile = await fetch(`/api/aws/upload-file`, {
    method: "GET",
    headers: {
      "File-Type": file.type,
      "File-Name": file.name,
    },
  })
  
  if (signedUrlFile.status === 401) {
    window.location.href = '/'
    const error = await signedUrlFile.json()
    throw new Error(error.message)
  }

  if (!signedUrlFile.ok) {
    const error = await signedUrlFile.json()
    throw new Error(error.message)
  }
  const { uploadUrl, fileUrl: s3FileUrl } = await signedUrlFile.json()

  const uploadFile = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  })
  if (uploadFile.status === 401) 
  {
    window.location.href = '/'
    const error = await uploadFile.json()
    throw new Error(error.message)
  }

  if (!uploadFile.ok) {
    const error = await uploadFile.text()
    console.log(error)
    throw new Error(error)
  }

  const rekognitionResponse = await fetch('/api/aws/analyze-image', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl: s3FileUrl }), // URL do arquivo no S3
  })
  
  if (!rekognitionResponse.ok) {
    const error = await rekognitionResponse.json()
    throw new Error(error.message)
  }
  
  const { isSensitive, labels } = await rekognitionResponse.json()

  return { fileUrl: s3FileUrl, fileName: file.name, isSensitive, labels }
}
