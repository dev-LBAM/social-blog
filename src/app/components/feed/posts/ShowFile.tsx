import Image from "next/image"
import { FaFileAlt, FaFileArchive, FaFileExcel, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa"

interface ShowFileProps 
{
  file: 
  {
    url: string
    type: string
    name: string
  }
  onImageClick: (imageUrl: string) => void
}

export default function ShowFile({ file, onImageClick }: ShowFileProps) 
{
  const getFileIcon = (fileType: string) => 
  {
    if (fileType.includes("pdf")) return <FaFilePdf className="text-red-500 w-5 h-5" />
    if (fileType.includes("msword") || fileType.includes("officedocument.wordprocessingml")) return <FaFileWord className="text-blue-500 w-5 h-5" />
    if (fileType.includes("spreadsheetml") || fileType.includes("excel")) return <FaFileExcel className="text-green-500 w-5 h-5" />
    if (fileType.includes("presentationml") || fileType.includes("powerpoint")) return <FaFilePowerpoint className="text-orange-500 w-5 h-5" />
    if (fileType.includes("zip") || fileType.includes("rar"))  return <FaFileArchive className="text-yellow-500 w-5 h-5" />
    return <FaFileAlt className="text-gray-500 w-5 h-5" />
  }

  return (
    <>
      {file && (
        <>
          {/* if was image */}
          {file.type.startsWith("image/") && (
            <Image
              src={file.url}
              alt="Post Image"
              width={1200}
              height={675}
              className="mt-1 max-h-[675px] cursor-pointer rounded-lg"
              onClick={() => onImageClick(file.url)}
            />
          )}

          {/* if was video */}
          {file.type.startsWith("video/") && (
            <video controls className="mt-2 w-full rounded-lg">
              <source src={file.url} type={file.type} />
              Your browser not suportted video.
            </video>
          )}

          {/* if was document */}
          {!file.type.startsWith("video/") && !file.type.startsWith("image/") && (
            <div className="mt-2 flex items-center gap-1">
              {getFileIcon(file.type)}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {file.name}
              </a>
            </div>
          )}
        </>
      )}
    </>
  )
}
