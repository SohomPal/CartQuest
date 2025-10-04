import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/lib/store-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "ShopQuest - Gamified Grocery Shopping",
  description: "Turn your grocery shopping into an exciting challenge",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <StoreProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
