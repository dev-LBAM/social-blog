'use client'

import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { FiPaperclip, FiSend, FiTrash2 } from "react-icons/fi"
import uploadFile from "./server/postRequests/uploadFile"
import ModalImage from "../../ui/ModalImage"
import CategorySelect from "./SelectCategory"
import { failToast, successToast } from "../../ui/Toasts"
import Tooltip from "../../ui/Tooltip"
import createCommentOrPost from "./server/postRequests/createCommentOrPost"

export default function CreatePost() 
{
  const [postText, setPostText] = useState<string | undefined>(undefined)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const maxLength = 10000


  useEffect(() => 
  {
    if(textareaRef.current) 
    {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [postText])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => 
  {
    const selectedFile = event.target.files ? event.target.files[0] : null
    if(selectedFile) 
    {
      setFile(selectedFile)

      if (selectedFile.type.startsWith("image/")) 
      {
        const previewUrl = URL.createObjectURL(selectedFile)
        setFilePreview(previewUrl)
      }
      else 
      {
        setFilePreview(null)
      }
    }
  }

  const handleRemoveFile = () => 
  {
    setFile(null)
    setFilePreview(null) 

    const fileInput = document.getElementById("file-input") as HTMLInputElement
    if(fileInput) 
    {
      fileInput.value = ""
    }
  }

  const queryClient = useQueryClient()

  const handlePostSubmit = async () => 
  {
    try 
    {
      if(isUploading) return
      setIsUploading(true)
      let fileUrl = ''
      let fileName = ''
      if (file) 
      {
        const res = await uploadFile(file)
        if(res) 
        {
          fileUrl = res.fileUrl
          fileName = res.fileName
        }
      }

      const postData = 
      {
        text: postText?.trim() || undefined,
        fileUrl: fileUrl?.trim() || undefined,
        fileName: fileName?.trim() || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined
      }

      const res = await createCommentOrPost({ data: postData })
      successToast('Post Sended', 'Your post was sended succesfully')
      queryClient.invalidateQueries({ queryKey: ["posts", res.post.userId] })
    }
    catch(error) 
    {
      failToast({ title: 'Failed to send post', error: error })
    }
    finally 
    {
      setFile(null)
      setFilePreview(null)
      setPostText('')
      setSelectedCategories([])
      setIsUploading(false)
    }
  }

  return (
    <div className="mb-10 bg-box p-4 rounded-xl shadow-xl">
      <div className="relative flex items-center gap-3">

        <textarea
          ref={textareaRef}
          rows={1}
          value={postText}
          maxLength={maxLength}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What are you thinking?"
          className="input-style-standard resize-none overflow-hidden "
        />

        <label htmlFor="file-input" className="  cursor-pointer inline-flex" >

        <div className="relative flex flex-col items-center w-fit">
          <div className="group relative">
              <FiPaperclip
                size={24}
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer"
              />

              <Tooltip text={'Attach File'} bgColor={'bg-gray-700'} borderT={'border-t-gray-700'} />
            </div>
          </div>

          <input
            key={file ? file.name : "file-input"}
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>

        <div className="relative flex flex-col items-center w-fit">
          <div className="group relative">
            <FiSend
              size={28}
              className={`transition-all duration-200 
              ${!postText?.trim() && !file || isUploading ? "text-gray-300 dark:text-neutral-600 cursor-not-allowed"
                  : "text-blue-500 hover:text-blue-600  cursor-pointer"
                }`}
              onClick={postText?.trim() || file ? handlePostSubmit : undefined}
            />

            <Tooltip text={'Send Post'} bgColor={'bg-blue-600'} borderT={'border-t-blue-600'} />
          </div>
        </div>

      </div>
      <div className="pt-1 flex items-center  gap-4 text-xs text-neutral-500">
        <p>{postText?.length ?? 0}/{maxLength}</p>
        <div className="w-1/2">
          <CategorySelect title={"Select an category to your post"} value={selectedCategories} onChange={setSelectedCategories} />
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
              <Tooltip text={'Remove File'} bgColor={'bg-red-400'} borderT={'border-t-red-400'} />
            </div>
          </div>

        </div>
      )}

      {filePreview && (
        <Image
          src={filePreview}
          alt="Preview Image"
          width={400}
          height={200}
          className="mt-1 w-full cursor-pointer rounded-lg"
          onClick={() => setSelectedImage(filePreview)}
        />
      )}

      <ModalImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

    </div>

  )

}
