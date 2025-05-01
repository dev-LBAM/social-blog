'use client'

import { useQueryClient } from "@tanstack/react-query"
import { useState, useRef, useEffect } from "react"
import { FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa"
import { failToast, successToast } from "../../ui/Toasts"

interface Post {
  _id: string
  commentsCount: number
}

interface PostsPage {
  posts: Post[]
}


export default function CommentMenu({ commentId, postId, parentId, onEditClick }: { commentId: string, postId?: string, parentId?:string, onEditClick: () => void}) {
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const queryClient = useQueryClient()
  
  const deleteComment = async () => {
    try 
    {

        const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: 'include'
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

        if(parentId)
        {
          queryClient.invalidateQueries({ queryKey: ["replies", parentId] })
          queryClient.invalidateQueries({ queryKey: ["comments", postId] })
          return successToast('Reply Deleted', 'Your reply was deleted succesfully')
        }
        queryClient.setQueryData<{
          pages: PostsPage[]
        }>(["posts"], oldData => {
          if (!oldData) return oldData
        
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              posts: page.posts.map(post => {
                if (post._id === postId) {
                  return {
                    ...post,
                    commentsCount: post.commentsCount - 1 
                  }
                }
                return post
              })
            }))
          }
        })
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        return successToast('Comment Deleted', 'Your comment was deleted succesfully')
    }
    catch (error) 
    {
        failToast({ title: 'Failed To Delete Comment', error: error })
    }
  }

  return (
    <div className="relative"> 
      <button
        onClick={() => setIsMenuOpen(isMenuOpen === commentId ? null : commentId)}
        className="absolute right-0 cursor-pointer text-color hover:text-neutral-800"
      >
        <FaEllipsisH size={20} />
      </button>

      {isMenuOpen === commentId && (
        <div
          ref={menuRef}
          className="absolute right-0 text-color bg-page shadow-lg rounded-md w-30 z-50"
        >
          <button
            className="w-full text-left pl-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1 rounded-md flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              onEditClick()
              setIsMenuOpen(null)
            }}
          >
            <FaEdit size={16} />
            <span className="ml-2 font-serif">Edit</span>
          </button>

          <button
            className="w-full text-left pl-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1 rounded-md flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
            onClick={deleteComment}
          >
            <FaTrash size={16} />
            <span className="ml-2 font-serif">Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}
