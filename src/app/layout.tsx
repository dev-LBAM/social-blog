import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Metadata } from "next"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Social Blog",
  description: "You have the world people in one place!",
  icons: {
    icon: "/social-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" translate="no" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
