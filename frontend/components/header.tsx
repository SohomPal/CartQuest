"use client"

import { useState } from "react"
import { Search, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useStore } from "@/lib/store-context"
import { StoreSelector } from "./store-selector"

export function Header() {
  const { currentStore, userPoints } = useStore()
  const [storeSelectorOpen, setStoreSelectorOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo and Store Selector */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] bg-clip-text text-transparent">
              CouponHunt
            </h1>
            <Button
              variant="outline"
              className="gap-2 font-semibold bg-transparent"
              onClick={() => setStoreSelectorOpen(true)}
            >
              <span className="text-lg">{currentStore.logo}</span>
              <span className="hidden sm:inline">{currentStore.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search challenges, items..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]"
                onClick={() => setStoreSelectorOpen(true)}
              />
            </div>
          </div>

          {/* Points and Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]">
              <span className="text-lg font-bold text-white">{userPoints.toLocaleString()}</span>
              <span className="text-sm font-medium text-white/90">pts</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-[var(--store-primary)]">
              <AvatarFallback className="bg-[var(--store-primary)] text-[var(--store-primary-foreground)]">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search challenges, items..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]"
              onClick={() => setStoreSelectorOpen(true)}
            />
          </div>
        </div>
      </header>

      <StoreSelector open={storeSelectorOpen} onOpenChange={setStoreSelectorOpen} />
    </>
  )
}
