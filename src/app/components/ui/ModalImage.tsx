import Image from "next/image"
import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"

interface ModalProps {
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
}

export default function ModalImage({ selectedImage, setSelectedImage }: ModalProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (!selectedImage) return

    const img = new window.Image()
    img.src = selectedImage
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null)
      }
    }

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedImage, setSelectedImage])

  if (!selectedImage || !dimensions) return null

  return (
<div
  className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
  onClick={() => setSelectedImage(null)}
>
  <button
    onClick={() => setSelectedImage(null)}
    className="absolute top-4 right-4 text-red-400 bg-black p-3 rounded-full hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
  >
    <IoClose size={30} />
  </button>

  <div
    className="relative w-full h-full max-w-full max-h-full"
    onClick={(e) => e.stopPropagation()}
  >
    <Image
      src={selectedImage}
      alt="Full Screen"
      layout="intrinsic"
      objectFit="contain"
      width={0}
      height={0}
      className="w-full h-full max-w-full max-h-full object-contain"
      unoptimized
    />
  </div>
</div>
  )
}
