'use client'

import { useQueryClient } from "@tanstack/react-query"
import { useState, useRef, useEffect } from "react"
import { FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa"
import { failToast, successToast } from "../../ui/Toasts"

export default function CommentMenu({
  commentId,
  parentId,
  onEditClick,
}: {
  commentId: string
  postId?: string
  parentId?: string
  onEditClick: () => void
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false) // 👈
  const menuRef = useRef<HTMLDivElement | null>(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(null)
        setConfirmDelete(false) // 👈 resetar confirmação
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const deleteComment = async () => {
    try {
      if (loading) return
      setLoading(true)

      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      if (res.status === 401) {
        window.location.href = '/'
      }

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      const data = await res.json()

      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
        queryClient.invalidateQueries({ queryKey: ["replies", data.parentId] })
        successToast('Reply Deleted', 'Your reply was deleted successfully')
      } else {
        queryClient.invalidateQueries({ queryKey: ["posts", data.userId] })
        queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
        successToast('Comment Deleted', 'Your comment was deleted successfully')
      }

      setIsMenuOpen(null)
    } catch (error) {
      failToast({ title: 'Failed To Delete Comment', error })
    } finally {
      setLoading(false)
      setConfirmDelete(false)
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
              setConfirmDelete(false)
            }}
          >
            <FaEdit size={16} />
            <span className="ml-2 font-serif">Edit</span>
          </button>

          <button
            className="w-full text-left text-color pl-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1 rounded-md flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              if (loading) return
              if (!confirmDelete) {
                setConfirmDelete(true)
              } else {
                deleteComment()
              }
            }}
          >
            <FaTrash size={16} />
            <span className="ml-2 font-serif">
              {confirmDelete ? 'Are you sure?' : 'Delete'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
