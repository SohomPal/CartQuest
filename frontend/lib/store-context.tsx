"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { stores, type Store, type ChallengeItem } from "./stores"

export interface CartItem extends ChallengeItem {
  challengeId: string
  challengeName: string
  status: "scanned" | "skipped"
  earnedPoints: number
}

interface StoreContextType {
  currentStore: Store
  setCurrentStore: (store: Store) => void
  userPoints: number
  addPoints: (points: number) => void
  cart: CartItem[]
  addToCart: (items: CartItem[]) => void
  clearCart: () => void
  getTotalCartPoints: () => number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentStore, setCurrentStoreState] = useState<Store>(stores[0])
  const [userPoints, setUserPoints] = useState(1250)
  const [cart, setCart] = useState<CartItem[]>([])

  const setCurrentStore = (store: Store) => {
    setCurrentStoreState(store)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-store", store.theme)
    }
  }

  const addPoints = (points: number) => {
    setUserPoints((prev) => prev + points)
  }

  const addToCart = (items: CartItem[]) => {
    setCart((prev) => [...prev, ...items])
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalCartPoints = () => {
    return cart.reduce((sum, item) => sum + item.earnedPoints, 0)
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-store", currentStore.theme)
    }
  }, [currentStore.theme])

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        setCurrentStore,
        userPoints,
        addPoints,
        cart,
        addToCart,
        clearCart,
        getTotalCartPoints,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
