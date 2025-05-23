import Image from "next/image"
import { useEffect, useState } from "react"

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
>
  <button
    onClick={() => setSelectedImage(null)}
    className="absolute top-4 right-4 transition-all duration-300 cursor-pointer"
  >
                <Image
                  src="/closeicon.png"
                  alt="Close Fullscreen Icon"
                  width={40}
                  height={40}
                  aria-hidden
                />
  </button>
<div className="w-screen h-screen flex items-center justify-center">
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
