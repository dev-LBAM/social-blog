"use client"

import { useEffect, useState } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./globals.css"
import { Toaster } from "sonner"

import ThemeToggleButton from "./components/ui/ThemeToggleButton"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <html lang="en" translate="no">
        <head>
          <meta name="google" content="notranslate" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} />
      </html>
    )
  }

  return (
    <html lang="en" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <ThemeToggleButton />
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              className:
                "animate-in slide-in-from-bottom fade-in left-1/2 -translate-x-1/2 transform",
            }}
            richColors
          />
        </QueryClientProvider>
      </body>
    </html>
  )
}
