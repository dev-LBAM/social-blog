import React from 'react'

type Props = {
  text: string
}

const YouTubeTextRenderer = ({ text }: Props) => {
  const regex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+)/g

  const parts = text.split(regex)

  return (
    <div className="text-color whitespace-pre-line break-words overflow-hidden">
      {parts.map((part, index) => {
        if (regex.test(part)) {
          const videoId = part.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          )?.[1]
  
          if (videoId) {
            return (
              <div key={index} className="my-4 aspect-video w-full rounded-md overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )
          }
        }
  
        return <p key={index}>{part}</p>
      })}
    </div>
  )
  
}

export default YouTubeTextRenderer
