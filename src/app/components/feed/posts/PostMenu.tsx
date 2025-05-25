'use client'

import { useQueryClient } from "@tanstack/react-query"
import { useState, useRef, useEffect } from "react"
import { FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa"
import { failToast, successToast } from "../../ui/Toasts"

export default function PostMenu({ postId, onEditClick }: { postId: string, onEditClick: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false) // 👈 estado de confirmação
  const menuRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(null)
        setConfirmDelete(false) // 👈 resetar confirmação se clicar fora
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const deletePost = async () => {
    try {
      if (loading) return
      setLoading(true)

      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      const response = await res.json()
      successToast('Post Deleted', 'Your post was deleted successfully')
      queryClient.invalidateQueries({ queryKey: ["posts", response.userId] })
      setIsMenuOpen(null)
    } catch (error) {
      failToast({ title: 'Failed To Delete Post', error })
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={() => setIsMenuOpen(isMenuOpen === postId ? null : postId)}
        className="cursor-pointer text-color hover:text-neutral-800"
      >
        <FaEllipsisH size={20} />
      </button>

      {isMenuOpen === postId && (
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
                deletePost()
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
