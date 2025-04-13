'use client'

import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import React, { useEffect, useId, useRef, useState } from "react"
import { FiPaperclip, FiSend, FiTrash2 } from "react-icons/fi"
import { failToast, successToast } from "../../ui/Toasts"
import CategorySelect from "./SelectCategory"
import uploadFile from "./server/postRequests/uploadFile"
import editCommentOrPost from "./server/postRequests/editCommentOrPost"

interface FileProps {
  fileEdit:
  {
    url: string
    type: string
    name: string
  }
  textProp: string
  onCancelEdit: () => void
  postId?: string
  commentId?: string
  categories?: string[]
}

export default function EditCommentOrPost({ fileEdit, textProp, onCancelEdit, postId, commentId, categories }: FileProps) 
{
  const [text, setText] = useState<string | undefined>(textProp)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const maxLength = postId ? 10000 : 1500
  const uniqueId = useId()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[] | undefined>(categories)

  useEffect(() => 
  {
    if(!fileEdit?.url) return

    if(!isEditing) 
    { 
      fetch(fileEdit.url)
        .then((res) => res.blob())
        .then((blob) => {
          const newFile = new File([blob], fileEdit.name, { type: fileEdit.type })
          setFile(newFile)

          if(fileEdit.type.startsWith("image") || fileEdit.type.startsWith("video")) 
          {
            setFilePreview(URL.createObjectURL(blob))
          } 
          else 
          {
            setFilePreview(null)
          }
        })
        .catch((err) => console.error("Error to load File Preview: ", err))
    }
  }, [fileEdit, isEditing])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => 
  {
    const selectedFile = event.target.files ? event.target.files[0] : null
    if (selectedFile) 
    {
      setIsEditing(true)
      setFile(selectedFile)
      setFilePreview(selectedFile.type.startsWith("image") || selectedFile.type.startsWith("video")
        ? URL.createObjectURL(selectedFile)
        : null)
    }
  }

  const handleRemoveFile = () => 
  {
    setFile(null)
    setFilePreview(null)
    setIsEditing(false)

    const fileInput = document.getElementById(`file-edit-input-${uniqueId}`) as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  useEffect(() => 
  {
    if(textareaRef.current) 
    {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  const queryClient = useQueryClient()
  const handlePostSubmit = async () => 
  {
    if(isUploading) return
    setIsUploading(true)
    let fileUrl = ''
    let fileName = ''
      try
      {
        if(file) 
        {
          if(fileEdit?.url)
          {
            await fetch(`/api/aws/delete-file`, 
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: fileEdit.url }),
            })
          }

          if (file) 
          {
            const res = await uploadFile(file)
            if(res) 
            {
              fileUrl = res.fileUrl
              fileName = res.fileName
            }

          }
          if (!file && fileEdit?.url) 
          {
            await fetch(`/api/aws/delete-file`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: fileEdit.url }),
            })
          }
        }
    
        const postData = {
          text: text?.trim() || undefined,
          fileUrl: fileUrl?.trim() || undefined,
          fileName: fileName?.trim() || undefined,
          categories: selectedCategories ? selectedCategories : undefined
        }
        

        const res = await editCommentOrPost({ postId: postId, commentId: commentId, data: postData })

        if(postId)
        {
          queryClient.invalidateQueries({ queryKey: ["posts", res.post.userId] })
          successToast('Post Edited', 'Your post was edited succesfully')
        }

        if(commentId)
        {
          (console.log('commnentId: ', commentId))
          queryClient.invalidateQueries({ queryKey: ["replies", commentId] })
          queryClient.invalidateQueries({ queryKey: ["comments", postId] })
          queryClient.invalidateQueries({ queryKey: ["posts"] })
          successToast('Comment Edited', 'Your comment was edited succesfully')
        }

      } 
      catch (error) 
      {
        failToast({title: "Failed To Edit Post", error: error})
      }
      finally
      {
        setText("")
        setFile(null)
        setSelectedCategories([])
        setFilePreview(null)
        setIsUploading(false)
        handleCancelEdit()
      }
  }



  const handleCancelEdit = () => {
    onCancelEdit()
  }
  
  return (
    <div className="mb-6 bg-page p-4 rounded-xl shadow-xl">
      <div className="relative flex items-center gap-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          maxLength={maxLength}
          onChange={(e) => setText(e.target.value)}
          placeholder="How you want to edit your post?"
          className="input-style-standard resize-none overflow-hidden"
        />

        <label htmlFor={`file-edit-input-${uniqueId}`} className="cursor-pointer inline-flex">
          <div className="relative group flex flex-col items-end">
            <FiPaperclip size={24} className="text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer" />
          </div>
        </label>
        <input
          key={file ? `file-edit-input-${uniqueId}` : "file-input"}
          id={`file-edit-input-${uniqueId}`}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <FiSend
          size={28}
          className={`transition-all duration-200 ${!text?.trim() && !file || isUploading ? "text-gray-300 dark:text-neutral-600 cursor-not-allowed" : "text-blue-500 hover:text-blue-600 cursor-pointer"}`}
          onClick={text?.trim() || file ? handlePostSubmit : undefined}
        />
      </div>

            <div className="pt-1 flex items-center  gap-4 text-xs text-neutral-500">
              <p>{text?.length ?? 0}/{maxLength}</p>
              <div className="w-1/2">
               {postId && <CategorySelect title={"Select an category to your post"} value={selectedCategories ?? []} onChange={setSelectedCategories} />}
              </div>
            </div>
      {file && (
        <div className=" mt-1 flex items-center text-sm text-color">
          <span className="mr-2 ">{file.name}</span>
          <div className="relative flex flex-col items-center w-fit">
            <div className="group relative">
              <FiTrash2
                onClick={handleRemoveFile}
                size={15}
                className="cursor-pointer text-red-300 hover:text-red-400 transition-all duration-200"
              />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-red-400 text-neutral-200 text-xs py-1 px-3 rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
                Remove File
                <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-red-400"></span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Exibição do preview de arquivo */}
      {filePreview && (
        file?.type.startsWith("image") ? (
          <Image 
          src={filePreview} 
          alt="Preview"
          width={400}
          height={200}
          className="mt-2 rounded-xl shadow-lg object-cover" />
        ) : file?.type.startsWith("video") ? (
          <video 
          src={filePreview} 
          controls 
          className="mt-2 rounded-xl max-h-50 h-auto shadow-lg" />
        ) : null
      )}

      <button 
      className="mt-3 ml-auto block cursor-pointer text-neutral-500 hover:text-neutral-600 transition-all duration-200 text-sm"
      onClick={handleCancelEdit}
      >
        Cancel Edit
      </button>
    </div>
  )
}
