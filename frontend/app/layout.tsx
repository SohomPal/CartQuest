import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/lib/store-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CouponHunt - Gamified Shopping",
  description: "Shopping Made Fun",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
