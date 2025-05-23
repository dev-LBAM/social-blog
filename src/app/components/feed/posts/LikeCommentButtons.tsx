import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { IoHeartOutline, IoHeart, IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from 'react-icons/io5'
import { failToast } from '../../ui/Toasts'
import Tooltip from '../../ui/Tooltip'
import { FiLoader } from 'react-icons/fi'

interface LikeCommentButtonsProps 
{
  likesCount: number
  commentsCount: number
  targetId: string
  targetType: "Post" | "Comment"
  postId?: string
  userId?: string
  isLiked: boolean
  onCommentClick: () => void
}

interface Post {
  _id: string
  likesCount: number
  hasLiked: boolean
}

interface PostsPage {
  posts: Post[]
}


  export default function LikeCommentButtons({likesCount, commentsCount, targetId, targetType, postId, userId, isLiked,  onCommentClick} : LikeCommentButtonsProps) 
{

  const [loading, setLoading] = useState<boolean>(false)
  const [showComment, setShowComment] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const handleLikeCreation = async () => 
  {
    try 
    {
      if(loading) return
      setLoading(true)
  
      const res = await fetch(`/api/likes/${targetId}?type=${targetType}`, {
        method: "POST",
      })
  
      if(res.status === 401) 
      {
        window.location.href = '/'
      }
          
      if(!res.ok) 
      {
        const error = await res.json()
        throw new Error(error.message)
      }
      const delta = res.status === 201 ? 1 : -1
      const like = res.status === 201 ? true : false
      if (targetType === "Post") {
        queryClient.setQueryData<{ pages: PostsPage[] }>(["posts", userId], oldData => {
          if (!oldData) return oldData
  
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              posts: page.posts.map(post => {
                if (post._id === targetId) {
                 queryClient.getQueryData<{ pages: PostsPage[] }>(["posts", userId])
                  return {
                    ...post,
                    likesCount: post.likesCount + delta,
                    hasLiked: like,
                  }
                }
                return post
              })
            }))
          }
        })
      }
      
      else if (targetType === "Comment") 
      {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      }
    } 
    catch (error) 
    {
      failToast({title: "Failed To Like Post", error: error})
    }
    finally
    {
      setLoading(false)
    }
  }
    
  return (
    <div className="flex items-center space-x-0.5 mt-1">
      {/* Likes */}
      <div className="relative flex flex-col items-center w-fit">
        <div className="group relative">
          <button
            onClick={() => {
              if(!loading){ 
                handleLikeCreation()}
            }}
            className={`transition-all duration-200 flex items-center
              ${loading ? "text-pink-800 hover:text-pink-700 cursor-not-allowed"
                : "text-pink-800 hover:text-pink-700 cursor-pointer"
              }`}
          >
            {loading ? (
              <FiLoader size={18} className="animate-spin" />
            ) : (
              isLiked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />
            )}
          </button>
          <Tooltip text={isLiked ? 'Unlike' : 'Like'} bgColor={'bg-pink-700'}/>
        </div>
      </div>
       
      <span className="text-color">{likesCount}</span>

      {/* Comments */}
      <div className="relative flex flex-col items-center w-fit">
        <div className="group relative">
          <button
            onClick={() => 
              {
                onCommentClick()
                setShowComment(!showComment)
              }}
              className={`transition-all duration-200 flex items-center text-blue-500 hover:text-blue-400 cursor-pointer
                `}
            >
            {showComment ? <IoChatbubbleEllipses size={20} className="ml-2" /> : <IoChatbubbleEllipsesOutline size={20} className="ml-2" />}
          </button>
          <Tooltip text={showComment ? 'Hide Comments' : 'Show Comments'} bgColor={'bg-blue-400'}/>
        </div>
      </div>
      <span className="text-color">{commentsCount}</span>
    </div>
  )
}
