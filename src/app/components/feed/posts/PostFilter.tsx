'use client'
import { FiSearch } from "react-icons/fi"
import CategorySelect from "./SelectCategory"
import { useState } from "react"

interface PostFilterProps
{
  search: string
  setSearch: (value: string) => void
  selectedCategories: string[]
  setSelectedCategories: (value: string[]) => void
}

export default function PostFilter({search, setSearch, selectedCategories, setSelectedCategories} : PostFilterProps) 
{
  const [onlyFollowers, setOnlyFollowers] = useState(false)

  return (
    <div className="mb-2 flex flex-col justify-between rounded-xl">
      <div className="relative w-full">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700" />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-style-standard"
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="relative w-1/2">
          <CategorySelect
            title="Select categories to filter posts"
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="onlyFollowers"
            checked={onlyFollowers}
            onChange={(e) => setOnlyFollowers(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="onlyFollowers" className="text-sm text-color">
            Show only posts from people you follow
          </label>
        </div>
      </div>
    </div>
  )
}
