'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { io, Socket } from 'socket.io-client'

type Follower =
  {
    _id: string
    name: string
    profileImg: string
    lastSeen: Date | null
  }

export default function SidebarFollowers() {
  const [isOpen, setIsOpen] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [onlineFollowers, setOnlineFollowers] = useState<Follower[]>([])
  const [offlineFollowers, setOfflineFollowers] = useState<Follower[]>([])

  const toggleSidebar = () => setIsOpen(!isOpen)

  useEffect(() => {
    console.log('sock: ',process.env.NEXT_PUBLIC_SOCKET_URL)
    const socketInstance: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true
    })

    if (!socketInstance) return
  
    const handleMutualFollowersOnline = (users: Follower[]) => setOnlineFollowers(users)
    const handleMutualFollowersOffline = (users: Follower[]) => setOfflineFollowers(users)
    const handleMutualFollowerLogin = (user: Follower) => 
    {
      setOfflineFollowers(prev => prev.filter(u => u._id !== user._id))
    
      setOnlineFollowers(prev => {
        if (prev.some(u => u._id === user._id)) return prev
        return [{ ...user, lastSeen: null }, ...prev]
      })
    }
    
    const handleMutualFollowerLogout = (user: Follower) => {
      setOnlineFollowers(prev => prev.filter(u => u._id !== user._id))
    
      setOfflineFollowers(prev => {
        if (prev.some(u => u._id === user._id)) return prev
        return [...prev, { ...user }]
      })
    }
    
    socketInstance.on('mutual_followers_online', handleMutualFollowersOnline)
    socketInstance.on('mutual_followers_offline', handleMutualFollowersOffline)
    socketInstance.on('mutual_follower_login', handleMutualFollowerLogin)
    socketInstance.on('mutual_follower_logout', handleMutualFollowerLogout)
  
    return () => {
      socketInstance.off('mutual_followers_online', handleMutualFollowersOnline)
      socketInstance.off('mutual_followers_offline', handleMutualFollowersOffline)
      socketInstance.off('mutual_follower_login', handleMutualFollowerLogin)
      socketInstance.off('mutual_follower_logout', handleMutualFollowerLogout)
      socketInstance.disconnect()
      socketInstance.off()
    }
  }, [])

  useEffect(() => 
  {
    const handleResize = () => 
    {
      if(window.innerWidth < 1450) 
      {
        setIsOpen(false)
        setShowButton(false)
      } 
      else
      {
        setIsOpen(true)
        setShowButton(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  return (
    <>
      {!showButton && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 p-2 rounded-lg z-30 flex items-center justify-center cursor-pointer"
          title={isOpen ? "Close" : "Open"}
        >
          <Image
            src={isOpen ? "/chat1.png" : "/chat0.png"}
            alt="chat toggle"
            width={40}
            height={40}
            className="object-contain hover:scale-110 transition-transform duration-300"
            aria-hidden
          />
        </button>
      )}

      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-page border-l border-neutral-200 dark:border-neutral-700 shadow-lg flex flex-col transition-transform duration-300 xl2:block ${isOpen ? "transform-none" : "transform translate-x-full"
          } ${isOpen || "xl2:hidden"}`}
      >
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-color">Mutual Followers</h2>
        </div>

        <div className="p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-neutral-500">Online ({onlineFollowers.length})</span>
          </div>

          {/* Online */}
          <div className="overflow-y-auto rounded-lg p-2  bg-box space-y-2">
            {onlineFollowers.map(f => (
              <div
                key={`online-${f._id}`}
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-page hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
              >
                <Image
                  src={
                    f.profileImg ? f.profileImg :
                    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  }
                  alt={f.name}
                  width={800}
                  height={600}
                  className="w-10 h-10 rounded-lg"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm hover:underline cursor-pointer text-color">
                    {f.name}
                  </span>
                  <span className="text-xs text-green-500">online</span>
                </div>
              </div>
            ))}
          </div>


          {/* Linha de separação */}
          <hr className="my-3 border-neutral-400 dark:border-neutral-600" />

          {/* Offline */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-neutral-500">Offline ({offlineFollowers.length})</span>
          </div>

          {offlineFollowers.map((f, index) => {
            const lastSeen = f.lastSeen
              ? new Date(f.lastSeen).toLocaleString('en-US', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                year: '2-digit',
                      hour12: false,
      timeZone: 'America/Sao_Paulo'
              })
              : 'Unknown'

            return (
              <div
                key={`offline-${f._id}`}
                className={`flex items-center space-x-3 p-2 rounded-lg bg-box hover:bg-page hover:scale-[1.02] transition-transform duration-200 cursor-pointer ${index !== 0 ? 'mt-2' : ''
                  }`}
              >
                <Image
                  src={
                    f.profileImg ||
                    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  }
                  alt={f.name}
                  width={800}
                  height={600}
                  className="w-10 h-10 rounded-lg"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm hover:underline text-color">{f.name}</span>
                  <span className="text-xs text-red-500">offline</span>
                  <span className="text-xs text-neutral-500 italic">
                    last seen on {lastSeen}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </aside>
    </>
  )

}
