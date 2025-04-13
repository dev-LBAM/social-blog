export default async function uploadFile( file: File) {
    try 
    {
        const signedUrlFile = await fetch(`/api/aws/upload-file`, {
          method: "GET",
          headers: {
            "File-Type": file.type,
            "File-Name": file.name,
          },
        })
        if (!signedUrlFile.ok) throw new Error("Error to send archive")

        const { uploadUrl, fileUrl: s3FileUrl } = await signedUrlFile.json()

        const uploadFile = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })
        if (!uploadFile.ok) throw new Error("Error to send archive")

        return { fileUrl: s3FileUrl, fileName: file.name }
      } 
      catch (error) 
      {
        console.error("Error to send archive: ", error)
      }
  }
