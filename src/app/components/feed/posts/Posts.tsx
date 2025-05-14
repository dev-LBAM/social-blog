"use client"

import { useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { FiLoader } from "react-icons/fi"
import PostMenu from "./PostMenu"
import LikeCommentButtons from "./LikeCommentButtons"
import PostComments from "./PostComments"
import CreateComment from "./CreateComment"
import ModalImage from "../../ui/ModalImage"
import ShowFile from "./ShowFile"
import { failToast } from "../../ui/Toasts"
import PostFilter from "./PostFilter"
import EditCommentorPost from "./EditCommentOrPost"
import ProfileMenu from "./ProfileMenu"
import calculateAge from "@/app/lib/utils/calculateAge"
import getDate from "@/app/lib/utils/getDate"
import YouTubeTextRenderer from "./YouTubeTextRenderer"

type Post = {
  _id: string
  userId: {
    _id: string
    username: string
    name: string
    profileImg: string
    email: string
    birthDate: string
    gender: string
    city: string
    state: string
    country: string
    createdAt: string
  }
  createdAt: string
  text: string
  file: {
    url: string
    type: string
    name: string
    isSensitive: boolean
    sensitiveLabel: string[]
  }
  hasLiked: boolean
  categories: [string]
  editAt: Date
  likesCount: number
  commentsCount: number
}

export default function Posts({ initialData, userId }: { initialData: object, userId: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [commentsVisibility, setCommentsVisibility] = useState<{ [key: string]: boolean }>({})
  const [editVisibility, setEditVisibility] = useState<{ [key: string]: boolean }>({})
  const [hasMounted, setHasMounted] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [onlyFollowers, setOnlyFollowers] = useState(false)
  const [followingIds, setFollowingIds] = useState<string[]>([])
  const [profileOpenMap, setProfileOpenMap] = useState<{ [key: string]: boolean }>({})

  const menuRef = useRef<HTMLDivElement | null>(null)

  const toggleProfileMenu = (postId: string) => {
    setProfileOpenMap(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpenMap({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  

  const [query, setQuery] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem('search-query') || ""
    }
    return ""
  })

  useEffect(() => {
    sessionStorage.setItem('search-query', query)
  }, [query])

  const toggleCommentsVisibility = (postId: string) => 
  {
    setCommentsVisibility((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  useEffect(() => 
  {
    setHasMounted(true)
  }, [])


  const fetchPosts = async ({ pageParam = null }) => 
  {
    try
    {
      const res = await fetch(`/api/posts?cursor=${pageParam || ""}&userId=${userId}&onlyFollowers=${onlyFollowers}`)
      if (!res.ok) 
      {
        const error = await res.json()
        throw new Error(error.message)
      }
      const result = await res.json()

      if (result.followingIds) 
      {
        setFollowingIds(result.followingIds)
      }
      return result ?? { posts: [], nextCursor: null }
    }
    catch(error)
    {
      failToast({title: "Failed To Load Posts", error: error})
    }

  }


  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error} = useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: fetchPosts,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {return lastPage?.nextCursor ?? null},
    initialData: { pages: [initialData], pageParams: [null] },
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  })

  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.resetQueries({
      queryKey: ['posts', userId],
      exact: true,
    })
  }, [onlyFollowers, userId, queryClient])
  

  const observerRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => 
  {
    if (!hasMounted || !observerRef.current || !hasNextPage) return


    const observer = new IntersectionObserver(([entry]) => {

      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    }, { threshold: 0.1 })

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [hasMounted, hasNextPage, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page?.posts ?? []) || []
  const filteredPosts = posts.filter((post: Post) => {
    const matchesText = !query || post.text?.toLowerCase().includes(query.toLowerCase())
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) => (post.categories ?? []).includes(category))
  
    const isFollowing = 
    !onlyFollowers || followingIds.includes(post.userId._id)
  
    return matchesText && matchesCategories && isFollowing
  })
  
  if(!hasMounted || isLoading) 
  {
    return (
      <div className="flex justify-center items-center py-4">
        <FiLoader size={30} className="animate-spin text-neutral-500" />
      </div>
    )
  }

  if(isError) 
  {
    return (
      <div className="text-red-500 text-center mt-10">
        Error: {error instanceof Error ? error.message : "An unexpected error occurred"}
      </div>
    )
  }

  const categoryMap: Record<string, { icon: string, label: string }> = {
    education: { icon: "📚", label: "Education" },
    news: { icon: "📰", label: "News" },
    technology: { icon: "💻", label: "Technology" },
    "art-design": { icon: "🎨", label: "Art & Design" },
    humor: { icon: "😂", label: "Humor" },
    "lifestyle-wellness": { icon: "🌱", label: "Lifestyle & Wellness" },
    "personal-stories": { icon: "📷", label: "Personal Stories" },
    music: { icon: "🎵", label: "Music" },
    "movies-tv": { icon: "🎬", label: "Movies & TV" },
    gaming: { icon: "🎮", label: "Gaming" },
    "food-recipes": { icon: "🍔", label: "Food & Recipes" },
    sports: { icon: "🏆", label: "Sports" },
    "health-fitness": { icon: "💪", label: "Health & Fitness" },
    "finance-investment": { icon: "💰", label: "Finance & Investment" },
    science: { icon: "🔬", label: "Science" },
    travel: { icon: "✈️", label: "Travel" },
    "environment-nature": { icon: "🌍", label: "Environment & Nature" },
    "politics-society": { icon: "🏛️", label: "Politics & Society" },
    "books-literature": { icon: "📖", label: "Books & Literature" },
    "tech-news": { icon: "🖥️", label: "Tech News" },
    "career-jobs": { icon: "💼", label: "Career & Jobs" },
    "diy-crafts": { icon: "🧵", label: "DIY & Crafts" },
    "events-festivals": { icon: "🎉", label: "Events & Festivals" },
    "animals-pets": { icon: "🐾", label: "Animals & Pets" },
  }
  
  

  return (
   <>
      <PostFilter
        search={query}
        setSearch={setQuery}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        onlyFollowers={onlyFollowers}
        setOnlyFollowers={setOnlyFollowers}
      />

      {filteredPosts.map((post: Post) => (
        <div key={post._id} className="p-4 mb-4 border-none rounded-lg bg-box shadow-md relative">
          {post.userId && (
            <div className="flex flex-col mb-2">
              <div className="flex items-start space-x-2">

                <Image
                  src={post.userId.profileImg || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                  alt={post.userId.name}
                  width={800}
                  height={600}
                  className="w-10 h-10 rounded-lg"
                />

                <div className="flex flex-col justify-start">
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className="font-semibold hover:underline cursor-pointer text-color"
                      onClick={() => toggleProfileMenu(post._id)}
                        
                    >
                      {post.userId.username}
                    </span>
                    {profileOpenMap[post._id] && (
                    <div ref={menuRef}  translate="no">
                      <ProfileMenu 
                        userId={userId} 
                        userName={post.userId.name}
                        userPostId={post.userId._id} 
                        userEmail={post.userId.email}
                        userAge={calculateAge(post.userId.birthDate)}
                        userCity={post.userId.city}
                        userState={post.userId.state}
                        userCountry={post.userId.country}
                        userSinceMember={getDate(post.userId.createdAt)}
                      />
                    </div>
                    )}

                    {post.categories?.map((category, index) => {
                      const categorie = categoryMap[category]
                      if (!categorie) return null

                      return (
                        <span
                          key={index}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-page text-color border border-neutral-300 dark:border-neutral-600"
                        >
                          <span>{categorie.icon}</span>
                          <span>{categorie.label}</span>
                        </span>
                      )
                    })}
                  </div>

                  <p className="text-xs text-neutral-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>

                </div>
              </div>
            </div>
          )}

          {post.editAt && (<p className="text-xs text-neutral-500">edited {formatDistanceToNow(new Date(post.editAt), { addSuffix: true })}</p>)}

          {post.userId._id === userId && (
            <PostMenu postId={post._id} onEditClick={() => setEditVisibility(() => ({ [post._id]: true }))} />
          )}

          {!editVisibility[post._id] ? (
            <>
              <YouTubeTextRenderer text={post.text} />
              {post.file && <ShowFile file={post.file} onImageClick={setSelectedImage} />}
            </>
          ) 
          : 
          (
            <EditCommentorPost fileEdit={post.file} textProp={post.text} onCancelEdit={() => setEditVisibility(() => ({ [post._id]: false }))} postId={post._id} categories={post.categories} />
          )}

          <LikeCommentButtons
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            targetId={post._id}
            targetType="Post"
            userId={userId}
            isLiked={post.hasLiked}
            onCommentClick={() => toggleCommentsVisibility(post._id)}
          />

          {commentsVisibility[post._id] && (
            <>
              <PostComments postId={post._id} userId={userId} />
              <CreateComment postId={post._id} />
            </>
          )}
          
        </div>
      ))}

      <ModalImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

      {hasNextPage ?
      (
        <div ref={observerRef} className="text-center py-4 text-color">
          {isFetchingNextPage ? "Loading more posts..." : "Load more by scrolling down"}
        </div>
      ) 
      :
      (
        <div ref={observerRef} className="text-center text-neutral-500">
          No more posts to show
        </div>
      )}
  </>

  )
}
