'use client'

import { useEffect, useState } from 'react'

export default function useUserId() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: 'include' })
        if (!res.ok) throw new Error('Unauthorized')
        const data = await res.json()
        setUserId(data)
      } catch (err) {
        console.error(err)
      }
    }

    getUserId()
  }, [])

  return userId
}
