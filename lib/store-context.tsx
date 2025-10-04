"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { stores, type Store } from "./stores"

interface StoreContextType {
  currentStore: Store
  setCurrentStore: (store: Store) => void
  userPoints: number
  addPoints: (points: number) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentStore, setCurrentStoreState] = useState<Store>(stores[0])
  const [userPoints, setUserPoints] = useState(1250)

  const setCurrentStore = (store: Store) => {
    setCurrentStoreState(store)
    // Update the data-store attribute on the document element
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-store", store.theme)
    }
  }

  const addPoints = (points: number) => {
    setUserPoints((prev) => prev + points)
  }

  useEffect(() => {
    // Set initial theme
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-store", currentStore.theme)
    }
  }, [currentStore.theme])

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore, userPoints, addPoints }}>
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
