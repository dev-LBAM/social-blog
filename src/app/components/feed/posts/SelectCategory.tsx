'use client'

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const categoryOptions = [
  {
    value: "education",
    label: "📚 Education",
    description: "Tutorials, tips, and educational content."
  },
  {
    value: "news",
    label: "📰 News",
    description: "Updates on current events and trends."
  },
  {
    value: "tech",
    label: "💻 Technology",
    description: "Posts about programming, gadgets, and innovation."
  },
  {
    value: "art",
    label: "🎨 Art & Design",
    description: "Creative work including illustration, photography, and design."
  },
  {
    value: "humor",
    label: "😂 Humor",
    description: "Funny posts, memes, and amusing stories."
  },
  {
    value: "insights",
    label: "💡 Thoughts & Ideas",
    description: "Reflections, opinions, and original ideas."
  },
  {
    value: "lifestyle",
    label: "🌱 Lifestyle & Wellness",
    description: "Well-being, habits, routines, and daily life tips."
  },
  {
    value: "personal",
    label: "📷 Personal Stories",
    description: "Real-life experiences, moments, and reflections."
  },
  {
    value: "question",
    label: "❓ Question",
    description: "Posts that ask for help, feedback, or opinions."
  },
  
]

export default function CategorySelect({
  title,
  value,
  onChange,
}: {
  title: string
  value: string[]
  onChange: (values: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
 const menuRef = useRef<HTMLDivElement | null>(null)
  const toggleCategory = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  

  return (
    <div ref={menuRef} className="relative text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-box border border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-500 dark:focus:ring-neutral-600 rounded-md px-3 py-1 flex justify-between items-center"
      >
        <span
          className="truncate text-color"
          title={
            value.length > 0
              ? categoryOptions
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
              : `📌 ${title}`
          }
        >
          {value.length > 0
            ? categoryOptions
              .filter((opt) => value.includes(opt.value))
              .map((opt) => opt.label)
              .join(", ")
            : `📌 ${title}`}
        </span>

        <ChevronDown size={16} className="text-color" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-64 overflow-y-auto w-full rounded-md bg-box dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 shadow-md p-2 space-y-1">
          {categoryOptions.map((option) => (
          <label
          key={option.value}
          className="flex flex-col items-start gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => toggleCategory(option.value)}
              className="accent-neutral-300 dark:accent-neutral-800"
            />
            <span className="text-color font-medium">{option.label}</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6">
            {option.description}
          </p>
          </label>
          ))}

        </div>
      )}
    </div>
  )
}
