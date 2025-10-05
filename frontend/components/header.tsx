"use client"

import { useState } from "react"
import { Search, Heart, ShoppingCart, User, ChevronDown, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useStore } from "@/lib/store-context"
import { StoreSelector } from "./store-selector"
import { CartDropdown } from "./cart-dropdown"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const { currentStore, userPoints, cart } = useStore()
  const [storeSelectorOpen, setStoreSelectorOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()
  const currentTab =
    pathname === "/leaderboard"
      ? "leaderboard"
      : pathname === "/weekly-ad"
      ? "weekly-ad"
      : pathname === "/digital-coupons"
      ? "digital-coupons"
      : "shoprite-live"

  const scannedItemsCount = cart.filter((item) => item.status === "scanned").length

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo and LIVE Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold" style={{ color: currentStore.colors.primary }}>
                  CouponHunt{/* {currentStore.name} */}
                </h1>
                <span
                  className="px-2 py-0.5 text-xs font-bold text-white rounded"
                  style={{ backgroundColor: currentStore.colors.primary }}
                >
                  LIVE
                </span>
              </div>

              {/* Store Selector Pill */}
              <Button
                variant="outline"
                className="gap-2 rounded-full border-gray-300 hover:border-gray-400 transition-colors bg-transparent"
                onClick={() => setStoreSelectorOpen(true)}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Store: {currentStore.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  style={{ color: currentStore.colors.primary }}
                />
                <input
                  type="text"
                  placeholder="Search stores, items, or challenges…"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-current focus:outline-none transition-colors text-base"
                  style={{ borderColor: "transparent" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentStore.colors.primary
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                  onClick={() => setStoreSelectorOpen(true)}
                />
              </div>
            </div>

            {/* Right Side: Points, Favorites, Cart, Profile */}
            <div className="flex items-center gap-3">
              {/* Points Chip with Sparkle */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
                style={{ backgroundColor: currentStore.colors.secondary }}
              >
                <Sparkles className="h-4 w-4" style={{ color: currentStore.colors.primary }} />
                <span className="text-base font-bold" style={{ color: currentStore.colors.primary }}>
                  {userPoints.toLocaleString()}
                </span>
                <span className="text-sm font-medium" style={{ color: currentStore.colors.primary }}>
                  pts
                </span>
              </div>

              {/* Favorites Icon */}
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Heart className="h-5 w-5 text-gray-700" />
              </Button>

              {/* Cart Icon with Badge */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {scannedItemsCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: currentStore.colors.primary }}
                  >
                    {scannedItemsCount}
                  </span>
                )}
              </Button>

              {/* Profile */}
              <Button variant="ghost" className="gap-2 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-xs text-gray-500">Hi, Risha</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stores, items, or challenges…"
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-current focus:outline-none transition-colors"
                onClick={() => setStoreSelectorOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-8 h-12">
              <Link href="/">
                <button
                  className={`text-sm font-medium transition-colors relative h-full ${
                    currentTab === "shoprite-live"
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Challenges
                  {currentTab === "shoprite-live" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: currentStore.colors.primary }}
                    />
                  )}
                </button>
              </Link>

              <Link href="/leaderboard">
                <button
                  className={`text-sm font-medium transition-colors relative h-full ${
                    currentTab === "leaderboard"
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Leaderboard
                  {currentTab === "leaderboard" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: currentStore.colors.primary }}
                    />
                  )}
                </button>
              </Link>

              <Link href="/weekly-ad">
                <button
                  className={`text-sm font-medium transition-colors relative h-full ${
                    currentTab === "weekly-ad"
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Weekly Ad
                  {currentTab === "weekly-ad" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: currentStore.colors.primary }}
                    />
                  )}
                </button>
              </Link>

              <Link href="/digital-coupons">
                <button
                  className={`text-sm font-medium transition-colors relative h-full ${
                    currentTab === "digital-coupons"
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Digital Coupons
                  {currentTab === "digital-coupons" && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: currentStore.colors.primary }}
                    />
                  )}
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <StoreSelector open={storeSelectorOpen} onOpenChange={setStoreSelectorOpen} />
      <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
