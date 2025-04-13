import { useEffect } from "react"
import { IoClose } from "react-icons/io5"

interface ModalProps {
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
}

export default function ModalImage({ selectedImage, setSelectedImage }: ModalProps) {
  useEffect(() => {
    if (!selectedImage) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, setSelectedImage])

  if (!selectedImage) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedImage}
          alt="Full Screen"
          className="max-w-full max-h-full object-contain"
        />
        
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 text-red-400 bg-black p-3 rounded-full hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
        >
          <IoClose size={30} />
        </button>
      </div>
    </div>
  )
}
