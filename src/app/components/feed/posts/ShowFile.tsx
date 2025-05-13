import Image from "next/image"
import { FaFileAlt, FaFileArchive, FaFileExcel, FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa"

interface ShowFileProps 
{
  file: 
  {
    url: string
    type: string
    name: string
    isSensitive: boolean
    sensitiveLabel: string[]
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
  <div className="relative mt-1">
    <Image
      src={file.url}
      alt="Post Image"
      width={1200}
      height={400}
      className={`
        w-full max-h-[500px] object-contain rounded-md cursor-pointer transition duration-300
        ${file.isSensitive ? "blur-3xl" : ""}
      `}
      onClick={() => onImageClick(file.url)}
    />

    {file.isSensitive && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-md p-4">
        <p className="mb-2 text-sm text-center">
          Sensitive content detected ({file.sensitiveLabel?.join(", ")})
        </p>
        <button
          onClick={() => onImageClick(file.url)}
          className="rounded-md cursor-pointer bg-page px-4 py-1 text-sm text-color"
        >
          see image anyway
        </button>
      </div>
    )}
  </div>
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
