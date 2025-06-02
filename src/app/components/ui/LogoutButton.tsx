'use client'

import { useEffect, useState } from "react"

export default function LogoutButton() {
  const [userExists, setUserExists] = useState<boolean>(false)

  useEffect(() => {
    const userId = sessionStorage.getItem("user-id")
    if (userId) setUserExists(true)
  }, [])

  const handleLogout = async () => {

    sessionStorage.clear()
    localStorage.clear()

    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=")
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, { method: "POST" })

    window.location.href = "/"
  }

  if (!userExists) return (
        <button
      type="button"
       className="fixed left-2 top-2 flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-700 hover:text-neutral-200  rounded-md px-2 py-2 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer font-sans z-50"
      onClick={handleLogout}
    >
      Sign In
    </button>
  )

  return (
<button
  type="button"
  className="fixed left-2 top-2 flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-700 hover:text-neutral-200  rounded-md px-2 py-2 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer font-sans z-50"
  onClick={handleLogout}
>
  Logout
</button>

  )
}
