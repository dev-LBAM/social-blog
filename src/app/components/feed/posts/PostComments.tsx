import { useInfiniteQuery } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import ModalImage from "../../ui/ModalImage"
import { FiChevronsDown, FiLoader } from "react-icons/fi"
import Image from "next/image"
import CreateComment from "./CreateComment"
import CommentReplies from "./CommentReplies"
import LikeCommentButtons from "./LikeCommentButtons"
import ShowFile from "./ShowFile"
import fetchComments from "./server/postRequests/fetchComments"
import CommentMenu from "./CommentMenu"
import EditCommentorPost from "./EditCommentOrPost"

interface Comment 
{
  _id: string
  userId: 
  {
    name: string
    profileImg: string
    username: string
    _id: string
  }
  file: 
  {
    url: string
    type: string
    name: string
    isSensitive: boolean
    sensitiveLabel: string[]
  }
  hasLiked: boolean
  text: string
  postId: string
  parentCommentId?: string
  likesCount: number
  commentsCount: number
  createdAt: string
}

export default function PostComments({ postId, userId }: { postId: string, userId: string }) 
{
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({})
  const [editVisibility, setEditVisibility] = useState<{ [key: string]: boolean }>({})


  const toggleReplies = (commentId: string) => 
  {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }))
  }

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
  
  
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error,} = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = null, signal }) => fetchComments({ pageParam, postId, userId, signal }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  })
  
  function removeDuplicateComments(comments: Comment[]) 
  {
    return Array.from(new Map(comments.map(c => [c._id, c])).values())
  }
  
  const allComments = data?.pages.flatMap((page) => page.comments) || []
  const comments = removeDuplicateComments(allComments)

  
  if(isLoading)
    return(
      <div className="flex justify-center items-center m-b-1">
        <FiLoader size={30} className="animate-spin text-neutral-500" />
      </div>
    )
    

  if (isError)
    return(
      <div className="text-red-500 text-center mt-10">
        Error: {error instanceof Error ? error.message : "An unexpected error occurred"}
      </div>
    )

  return (
    <>
      <div className="mt-4 space-y-2 text-xs">
        {comments.length > 0 ? (
          <>
            {comments.map((c: Comment) => (
              <div key={c._id} className="flex flex-col bg-page p-2 rounded-lg">
                <div className="flex items-start space-x-2">

                  <Image
                    src={c.userId.profileImg}
                    alt={`Foto de perfil de ${c.userId.name}`}
                    width={800}
                    height={600}
                    className="w-8 h-8 rounded-full"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold hover:underline cursor-pointer text-color text-sm pr-2">
                          {c.userId.username}
                        </span>
                        <span className="text-neutral-500">
                          {format(new Date(c.createdAt), "dd/MM/yyyy HH:mm")}{" "}
                          ({formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })})
                        </span>
                      </div>

                      {c.userId._id === userId && (
                        <CommentMenu commentId={c._id} postId={c.postId} onEditClick={() => setEditVisibility(() => ({ [c._id]: true }))} />
                      )}
                    </div>


                    {!editVisibility[c._id] ? (
                      <>
                        <p className="text-color text-sm mt-1 whitespace-pre-line break-all overflow-hidden">{c.text}</p>
                        {c.file && <ShowFile file={c.file} onImageClick={onImageClick} />}
                      </>
                    )
                      :
                      (

                        <EditCommentorPost fileEdit={c.file} textProp={c.text} onCancelEdit={() => setEditVisibility(() => ({ [c._id]: false }))} commentId={c._id} />
                      )}



                      <LikeCommentButtons
                        likesCount={c.likesCount}
                        commentsCount={c.commentsCount}
                        targetId={c._id}
                        targetType="Comment"
                        postId={c.postId}
                        isLiked={c.hasLiked}
                        onCommentClick={() => toggleReplies(c._id)}
                      />

                      {showReplies[c._id] && (
                        <>
                          <CommentReplies commentId={c._id} userId={userId}/>
                          <CreateComment postId={postId} commentId={c._id} />
                        </>
                      )}
                    </div>

                  </div>
                </div>
              ))}
              
            {hasNextPage && comments.length >= 3 ? (
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
                    Load More Comments
                  </span>

                </div>
              </div>
            ) 
            : 
            (<p className="mt-2 mb-2 text-center text-neutral-500">No more comments</p>)}
          </>
        ) 
        : 
        (
          <p className="mt-2 mb-2 text-center text-neutral-500">No comments yet</p>
        )}
      
      </div>

      <ModalImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </>
  )
}
