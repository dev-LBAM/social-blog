'use client'

import { useEffect, useState } from "react"

export default function LogoutButton() {
  const [userExists, setUserExists] = useState<boolean>(false)

  useEffect(() => {
    const userId = sessionStorage.getItem("user-id")
    if (userId) setUserExists(true)
  }, [])

  const handleLogout = async () => {
    // Limpa tudo do lado do client
    sessionStorage.clear()
    localStorage.clear()

    // Deleta cookies client-side (por segurança)
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=")
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })

    // Chama rota que deleta os cookies do servidor
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, { method: "POST" })

    // Redireciona
    window.location.href = "/"
  }

  if (!userExists) return (
        <button
      type="button"
      className="fixed left-2 top-2 flex items-center gap-1 bg-box text-color rounded-md px-2 py-2 text-sm font-medium hover:bg-neutral-500 transition-colors shadow-sm cursor-pointer font-sans z-50"
      onClick={handleLogout}
    >
      Sign In
    </button>
  )

  return (
    <button
      type="button"
      className="fixed left-2 top-2 flex items-center gap-1 bg-box text-color rounded-md px-2 py-2 text-sm font-medium hover:bg-neutral-500 transition-colors shadow-sm cursor-pointer font-sans z-50"
      onClick={handleLogout}
    >
      Logout
    </button>
  )
}
