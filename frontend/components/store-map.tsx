"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChallengeItem } from "@/lib/stores"

interface StoreMapProps {
  isOpen: boolean
  onClose: () => void
  challengeItems?: ChallengeItem[]
}

export function StoreMap({ isOpen, onClose, challengeItems = [] }: StoreMapProps) {
  if (!isOpen) return null

  const sections = [
    { id: "produce", name: "Produce", position: "top-4 left-4", color: "bg-green-500" },
    { id: "dairy", name: "Dairy", position: "top-4 right-4", color: "bg-blue-500" },
    { id: "meat", name: "Meat", position: "top-1/3 left-4", color: "bg-red-500" },
    { id: "bakery", name: "Bakery", position: "top-1/3 right-4", color: "bg-amber-500" },
    { id: "pantry", name: "Pantry", position: "top-2/3 left-1/4", color: "bg-purple-500" },
    { id: "snacks", name: "Snacks", position: "top-2/3 right-1/4", color: "bg-pink-500" },
    { id: "beverages", name: "Beverages", position: "bottom-4 left-4", color: "bg-cyan-500" },
    { id: "health", name: "Health", position: "bottom-4 right-4", color: "bg-teal-500" },
  ]

  const activeSections = new Set(
    challengeItems
      .map((item) => {
        const location = item.location.toLowerCase()
        if (location.includes("produce")) return "produce"
        if (location.includes("dairy")) return "dairy"
        if (location.includes("meat")) return "meat"
        if (location.includes("bakery")) return "bakery"
        if (location.includes("pantry") || location.includes("aisle")) return "pantry"
        if (location.includes("snack")) return "snacks"
        if (location.includes("beverage") || location.includes("drink")) return "beverages"
        if (location.includes("health") || location.includes("pharmacy")) return "health"
        return null
      })
      .filter(Boolean),
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white border-t-2 border-gray-200 shadow-2xl rounded-t-3xl overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Store Map</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Map */}
          <div className="relative h-96 bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded" />
              ))}
            </div>

            {/* Store Sections with Glowing Orbs */}
            {sections.map((section) => {
              const hasItems = activeSections.has(section.id)
              return (
                <div key={section.id} className={`absolute ${section.position}`}>
                  <div className="relative">
                    {hasItems && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="relative">
                          <div className={`w-4 h-4 ${section.color} rounded-full animate-glow-pulse`} />
                          <div
                            className={`absolute inset-0 ${section.color} rounded-full blur-md opacity-60 animate-glow-pulse`}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className={`${section.color} ${
                        hasItems ? "ring-2 ring-yellow-400 ring-offset-2" : ""
                      } text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all`}
                    >
                      <span className="font-semibold text-sm">{section.name}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Entrance */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="bg-gray-700 text-white px-6 py-2 rounded-full font-semibold text-sm">Entrance</div>
            </div>
          </div>

          {challengeItems.length > 0 && (
            <p className="text-sm text-center text-gray-600">
              Glowing sections contain items from your current challenge
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
