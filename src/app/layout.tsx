import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My Blog",
  description: "Project of a Blog, by dev.LBAM",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
