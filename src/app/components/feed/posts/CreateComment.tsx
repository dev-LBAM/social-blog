'use client'

import { useEffect, useId, useRef, useState } from "react"
import { FiPaperclip, FiSend, FiTrash2 } from "react-icons/fi"
import { useQueryClient } from "@tanstack/react-query"
import uploadFile from "./server/postRequests/uploadFile"
import Image from "next/image"
import { failToast, successToast } from "../../ui/Toasts"
import Tooltip from "../../ui/Tooltip"
import createCommentOrPost from "./server/postRequests/createCommentOrPost"
import ModalImage from "../../ui/ModalImage"

export default function CreateComment({ postId, commentId }: { postId: string , commentId?: string }) 
{
  const uniqueId = useId()
  const [comment, setComment] = useState<string>("")
  const [commentFile, setCommentFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [commentFilePreview, setCommentFilePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const maxLength = 1500

  useEffect(() => 
  {
    if(textareaRef.current) 
    {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [comment])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => 
  {
    const selectedFile = event.target.files ? event.target.files[0] : null
    if(selectedFile) 
    {
      setCommentFile(selectedFile)

      if(selectedFile.type.startsWith("image/")) 
      {
        const previewUrl = URL.createObjectURL(selectedFile)
        setCommentFilePreview(previewUrl)
      } 
      else 
      {
        setCommentFilePreview(null)
      }
    }
  }

  const handleRemoveFile = () => 
  {
    setCommentFile(null)
    setCommentFilePreview(null)
    const fileInput = document.getElementById("file-input") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const queryClient = useQueryClient()
  const handleCommentSubmit = async () => 
  {
    try 
    {
      if(isUploading) return
      setIsUploading(true)
      let fileUrl = ''
      let fileName = ''
      let isSensitive = false
      let sensitiveLabel = []
      if(commentFile)
      {
        const res = await uploadFile(commentFile)
        if(res)
        {
          fileUrl = res.fileUrl
          fileName = res.fileName
          isSensitive = res.isSensitive
          sensitiveLabel = res.labels
        }
      }
  
      const commentData = 
      {
        text: comment?.trim() || undefined,
        fileUrl: fileUrl?.trim() || undefined,
        fileName: fileName?.trim() || undefined,
        isSensitive: isSensitive,
        sensitiveLabel: sensitiveLabel.length > 0 ? sensitiveLabel : undefined,
        parentCommentId: commentId,
      }

      const res = await createCommentOrPost({postId, data: commentData})

      if(commentId != undefined) 
      {
        queryClient.invalidateQueries({ queryKey: ["replies", commentId] })
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        successToast('Reply Sended', 'Your reply was sended succesfully')
        
      }
      else
      {
        
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        queryClient.invalidateQueries({ queryKey: ["posts", res.userId] })
        successToast('Comment Sended', 'Your comment was sended succesfully')
      }
    } 
    catch (error) 
    {
      failToast({title: "Failed To Create Comment", error: error})
    }
    finally
    {
      setIsUploading(false)
      setComment("")
      setCommentFile(null)
      setCommentFilePreview(null)
    }
  }
  
  

  return (
    <div className="rounded-xl mt-2">
      {/* Input of Create Comment */}
      <div className="relative flex items-center gap-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={comment}
          maxLength={maxLength}
          onChange={(e) => setComment(e.target.value)}
          placeholder={commentId ? "Reply to this comment..." : "Comment something..."}
          className="input-style-standard resize-none overflow-hidden"
        />

        {/* Attach File Button */}
        <label htmlFor={`file-comment-input-${uniqueId}`} className="cursor-pointer inline-flex">
        <div className="relative flex flex-col items-center w-fit">
          <div className="group relative">
              <FiPaperclip
                size={24}
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer"
              />

              <Tooltip text={'Attach File'} bgColor={'bg-gray-700'} />
            </div>
          </div>
          <input 
          id={`file-comment-input-${uniqueId}`} 
          type="file" onChange={handleFileChange} 
          accept="image/*"
          className="hidden" />
          </label>

        {/* Send Button */}
        <div className="relative flex flex-col items-center w-fit">
          <div className="group relative">
          <FiSend
            size={28}
            className={`transition-all duration-200 
              ${!comment?.trim() && !commentFile || isUploading ? "text-gray-300 dark:text-neutral-600 cursor-not-allowed" : "text-blue-500 hover:text-blue-600 cursor-pointer"}`}
            onClick={comment?.trim() || commentFile ? handleCommentSubmit : undefined}
          />

          <Tooltip text={'Send Comment'} bgColor={'bg-blue-600'} />
          </div>
        </div>
      </div>

      <p className="pt-1 text-xs text-neutral-500">{comment?.length ? comment?.length : 0}/{maxLength}</p>

      {/* Name File + Remove */}
      {commentFile && (
        <div className="flex items-center text-sm text-color">
          <span className="mr-2">{commentFile?.name}</span>
            <div className="relative flex flex-col items-center w-fit">
              <div className="group relative">
                <FiTrash2
                  onClick={handleRemoveFile}
                  size={15}
                  className="cursor-pointer text-red-300 hover:text-red-400 transition-all duration-200"
                />
                <Tooltip text={'Remove File'} bgColor={'bg-red-400'}/>
              </div>
            </div>
        </div>
      )}

      {/* Preview Image/Video */}
      {commentFilePreview && (
      <div className="mt-2 max-w-full max-h-[300px] overflow-hidden cursor-pointer">
        <Image
          src={commentFilePreview}
          alt="Preview Image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-auto max-h-[300px] rounded-lg  object-contain"
          onClick={() => setSelectedImage(commentFilePreview)}
        />
      </div>
    )}
<ModalImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </div>
  )
}
