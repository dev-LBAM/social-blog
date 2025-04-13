"use client"

import { Geist, Geist_Mono } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./globals.css"
import { Toaster } from "sonner"

import { ThemeProvider } from 'next-themes'
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" >
      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
