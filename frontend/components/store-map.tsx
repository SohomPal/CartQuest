"use client"

import { X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StoreMapProps {
  isOpen: boolean
  onClose: () => void
  highlightLocation?: string
}

export function StoreMap({ isOpen, onClose, highlightLocation }: StoreMapProps) {
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-background border-t-2 border-border shadow-2xl rounded-t-3xl overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Store Map</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Map */}
          <div className="relative h-96 bg-muted rounded-xl border-2 border-border overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-border/30 rounded" />
              ))}
            </div>

            {/* Store Sections */}
            {sections.map((section) => {
              const isHighlighted = highlightLocation?.toLowerCase().includes(section.name.toLowerCase())
              return (
                <div key={section.id} className={`absolute ${section.position}`}>
                  <div
                    className={`${section.color} ${
                      isHighlighted ? "ring-4 ring-yellow-400 scale-110" : ""
                    } text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all`}
                  >
                    {isHighlighted && <MapPin className="h-4 w-4 animate-bounce" />}
                    <span className="font-semibold text-sm">{section.name}</span>
                  </div>
                </div>
              )
            })}

            {/* Entrance */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="bg-gray-700 text-white px-6 py-2 rounded-full font-semibold text-sm">Entrance</div>
            </div>
          </div>

          {highlightLocation && (
            <p className="text-sm text-center text-muted-foreground">
              Item location: <span className="font-semibold text-foreground">{highlightLocation}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
