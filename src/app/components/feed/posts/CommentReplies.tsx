import { useInfiniteQuery } from "@tanstack/react-query"
import { FiChevronsDown, FiLoader } from "react-icons/fi"
import { format, formatDistanceToNow } from "date-fns"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import fetchCommentReplies from "./server/postRequests/fetchCommentReplies"
import CommentMenu from "./CommentMenu"
import ShowFile from "./ShowFile"
import EditCommentOrPost from "./EditCommentOrPost"

type Reply = 
{
  _id: string
  userId: {
    name: string
    profileImg: string
    _id: string
  }
  file: {
    url: string
    type: string
    name: string
    isSensitive: boolean
    sensitiveLabel: string[]
  }
  text: string
  createdAt: string
}



export default function CommentReplies({ commentId, userId } : {commentId: string, userId: string}) 
{
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editVisibility, setEditVisibility] = useState<{ [key: string]: boolean }>({})

  const onImageClick = (imageUrl: string) => 
  {
    setSelectedImage(imageUrl)
  }

  useEffect(() => 
  {
    document.body.style.overflow = selectedImage ? "hidden" : "auto"
    return () => 
    {
      document.body.style.overflow = "auto"
    }
  }, [selectedImage])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, } = useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: ({ pageParam = null, signal }) => fetchCommentReplies({ pageParam, commentId, signal }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  })

  const allReplies: Reply[] = data?.pages.flatMap((page) => page.replies) || []

  if(isLoading)
    return (
      <div className="flex justify-center items-center">
        <FiLoader size={30} className="animate-spin text-neutral-500" />
      </div>
    )

  if(isError)
    return (
      <div className="text-red-500 text-center mt-2">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    )

  return (
    <div className="space-y-2">
      {allReplies.length > 0 ? (
        <>
      {allReplies.map((reply) => (
        <div key={reply._id} className="flex mt-2 bg-box p-2 rounded-lg items-start space-x-2">
          {/* Profile Image */}
          <Image
            src={reply.userId.profileImg}
            alt={`Foto de perfil de ${reply.userId.name}`}
            width={800}
            height={600}
            className="w-6 h-6 rounded-full"
          />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold hover:underline cursor-pointer text-color text-sm pr-2">
                          {reply.userId.name}
                        </span>
                        <span className="text-neutral-500">
                          {format(new Date(reply.createdAt), "dd/MM/yyyy HH:mm")}{" "}
                          ({formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })})
                        </span>
                      </div>

                      {reply.userId._id === userId && (
                        <CommentMenu commentId={reply._id} parentId={commentId} onEditClick={() => setEditVisibility(() => ({ [reply._id]: true }))} />
                      )}
                    </div>


                    {!editVisibility[reply._id] ? (
                      <>
                        <p className="text-color text-sm mt-1 whitespace-pre-line break-all overflow-hidden">{reply.text}</p>
                        {reply.file && <ShowFile file={reply.file} onImageClick={onImageClick} />}
                      </>
                    )
                      :
                      (

                        <EditCommentOrPost fileEdit={reply.file} textProp={reply.text} onCancelEdit={() => setEditVisibility(() => ({ [reply._id]: false }))} commentId={reply._id} />
                      )}


                    </div>
          </div>
       
      ))}


  
            {hasNextPage ? (
              <div className="mt-2 mb-2 text-center">
                <div className="relative group flex flex-col items-center">

                  {isFetchingNextPage ? (
                    <FiLoader size={30} className="animate-spin text-neutral-500" />
                  ) 
                  : 
                  (
                    <FiChevronsDown
                      size={30}
                      onClick={() => fetchNextPage()}
                      className="cursor-pointer text-color"
                    />
                  )}

                  <span className="absolute bottom-8 bg-box text-color text-xs py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Load More Replies
                  </span>

                </div>
              </div>
            ) 
            : 
            (<p className="mt-2 mb-2 text-center text-neutral-500">No more replies</p>)}
          </>
        ) 
        : 
        (
          <p className="mt-2 mb-2 text-center text-neutral-500">No replies yet</p>
        )}

    </div>
  )
}
