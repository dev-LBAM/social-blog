"use client"

import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import ThemeToggleButton from "./components/ui/ThemeToggleButton"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeToggleButton isSidebarOpen={true} />
      {children}
<Toaster
  position="bottom-center"
  toastOptions={{
    className: "max-w-[90vw] break-words whitespace-normal px-4 py-3 rounded-xl shadow-lg bg-page text-color",
    style: {
      left: "50%",
      transform: "translateX(-50%)",
    },
    duration: 4000,
  }}
/>

    </QueryClientProvider>
  )
}
