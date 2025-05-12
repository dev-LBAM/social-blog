'use client'

import { useState,  useEffect, useCallback } from "react"
import { failToast, successToast } from "../../ui/Toasts"
import { IoMail, IoPersonAdd, IoPersonAddOutline, IoSettingsSharp } from "react-icons/io5"
import { FiLoader } from "react-icons/fi"

interface ProfileProps{
    userId: string, 
    userPostId: string,
    userEmail: string,
    userAge: number,
    userCity: string,
    userState: string,
    userCountry: string,
    userSinceMember: string,
}

export default function ProfileMenu({ userId, userPostId, userEmail, userAge, userCity, userState, userCountry, userSinceMember} : ProfileProps) 
{

    const [loading, setLoading] = useState<boolean>(false)
    const [followingCount, setFollowingCount] = useState<number | null>(null)
    const [followersCount, setFollowersCount] = useState<number | null>(null)
    const [isFollowing, setIsFollowing] = useState<number | null>(null)
    const [copied, setCopied] = useState(false)
    const copyToClipboard = async (text: string) => 
    {
        try 
        {
            if(loading) return
            setLoading(true)
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } 
        catch (err) 
        {
            failToast({title: "Failed To Copy Email", error: err})
        }
        finally
        {
            setLoading(false)
        }
    }

    const loadUserFollowers = useCallback(async () => 
    {
        try 
        {
          if(loading) return
          setLoading(true)
      
          const res = await fetch(`/api/followers/${userPostId}`, {
            method: "GET"
          })
      
          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message)
          }
      
          const data = await res.json()
          setFollowingCount(data.following)
          setFollowersCount(data.followers)
          setIsFollowing(data.isFollowing)
        } catch (error) {
          failToast({ title: "Failed To Load Profile User", error: error })
        } finally {
          setLoading(false)
        }
      }, [loading, userPostId])
      
        useEffect(() => 
        {
            loadUserFollowers()
        }, [loadUserFollowers])
      

    const onFollowClick = async () => {
      try {
        if(loading) return
        setLoading(true)

        const res = await fetch(`/api/followers/${userPostId}`, {
          method: "POST",
          credentials: "include"
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message)
        }
        const data = await res.json()
        if(res.status == 201)
        {
            setIsFollowing(data.isFollowing)
            return successToast('User Followed', 'You follow the user successfully')
        }
        if(res.status == 200)
        {
            setIsFollowing(data.isFollowing)
            return successToast('User Unfollowed', 'You unfollow the user successfully')
        }
      }
      catch (error) {
        failToast({ title: 'Failed To Follow User', error: error })
      }
      finally 
      {
        loadUserFollowers()
        setLoading(false)
      }
    }

    return (
      <div className="absolute top-10 left-16 " >

        <div className="absolute left-0 text-color bg-page shadow-lg rounded-md w-40  z-50">
            <div className="text-[11px] whitespace-nowrap overflow-hidden px-2 text-color">
            
            <div className="flex">
                <span >Email:&nbsp;</span>

                <span
                    title="Click to copy!"
                    onClick={() => copyToClipboard(userEmail)}
                    className="truncate hover:underline cursor-pointer"
                >
                    {userEmail}
                </span>
            </div>
               
                {copied && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-page text-color text-xs px-3 py-1 rounded shadow-lg animate-fade-in-out">
                    Email copied!
                    </div>
                )}

                <p>City: {userCity}</p>
                <p>State: {userState}</p>
                <p>Country: {userCountry}</p>
                <p>Age: {userAge} Years</p>
                <p>Member Since: {userSinceMember}</p>

            
        <p>
            {loading ? (
                <FiLoader size={11} className="inline animate-spin mr-1" />
            ) : (
                <span className="mr-1">{followingCount}</span>
            )}
            following
        </p>


        <p >
            {loading ? (
                <FiLoader size={11} className="inline animate-spin mr-1" />
            ) : (
                <span className="mr-1">{followersCount}</span>
            )}
            followers
        </p>

            </div>
       
                {userId !== userPostId ? (
                    <>
                        <button
                            className="w-full text-left text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded-md flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                            onClick={onFollowClick}
                        >
                            {isFollowing ? <IoPersonAdd size={16} /> : <IoPersonAddOutline size={16} />}
                            <span className="ml-2 font-serif">
                                {isFollowing ? "Unfollow" : "Follow"}
                            </span>
                        </button>

                        <button
                            className="w-full text-left text-color text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded-md flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                            onClick={() => { }}
                        >
                            <IoMail size={16} />
                            <span className="ml-2 font-serif">Message</span>
                        </button>
                    </>
                ) : (
                    <button
                        className="w-full text-left text-color text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded-md flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                        onClick={() => { }}
                    >
                        <IoSettingsSharp  size={16} />
                        <span className="ml-2 font-serif">Edit Profile</span>
                    </button>
                )}



        </div>

      </div>
    )
}

