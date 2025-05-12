"use client"

import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
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
      <ThemeToggleButton />
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "animate-in slide-in-from-bottom fade-in left-1/2 -translate-x-1/2 transform",
        }}
        richColors
      />
    </QueryClientProvider>
  )
}
