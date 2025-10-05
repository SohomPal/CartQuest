"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChallengeItem } from "@/lib/stores"
import map1 from "./images/map1.png"


interface StoreMapProps {
  isOpen: boolean
  onClose: () => void
  currentItem?: ChallengeItem
}
// ...existing code...
export function StoreMap(props: StoreMapProps) {
  const { isOpen, onClose, currentItem } = props
  if (!isOpen) return null

  // Section definitions (same as before)
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

  // Hardcoded mapping from item to section id
  function getSectionIdForItem(item?: ChallengeItem): string | null {
    if (!item) return null
    const location = (item.location || "").toLowerCase()
    const category = (item.category || "").toLowerCase()
    if (location.includes("produce") || category.includes("produce")) return "produce"
    if (location.includes("dairy") || category.includes("dairy")) return "dairy"
    if (location.includes("meat") || category.includes("meat")) return "meat"
    if (location.includes("bakery") || category.includes("bakery")) return "bakery"
    if (location.includes("pantry") || location.includes("aisle") || category.includes("pantry")) return "pantry"
    if (location.includes("snack") || category.includes("snack")) return "snacks"
    if (location.includes("beverage") || location.includes("drink") || category.includes("beverage")) return "beverages"
    if (location.includes("health") || location.includes("pharmacy") || category.includes("health")) return "health"
    return null
  }

  const activeSectionId = getSectionIdForItem(currentItem)

  return (
    <div className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2 w-full">
      <div className="mx-auto w-full max-w-3xl px-4 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white border-2 border-gray-200 shadow-2xl rounded-t-3xl overflow-hidden pb-[env(safe-area-inset-bottom)]">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Store Map</h3>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close map">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Map area */}
<div className="relative rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50">
  {/* shrink-wrap wrapper: inline-block so it fits to the image */}
  <div className="relative inline-block max-w-full">
    <img
      src={map1.src}
      alt="Store floor plan"
      className="block max-w-full max-h-[75vh] h-auto w-auto pointer-events-none"
      draggable={false}
    />

    {/* Marker overlay lives inside the same relative box */}
    {activeSectionId && (() => {
      const section = sections.find(s => s.id === activeSectionId)!
      // Example: if you move to % coords, center with translate
      return (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: '18%', top: '12%' }} // <-- your coords
        >
          {/* HALO */}
          <span
            className={`absolute -inset-7 ${section.color} rounded-full opacity-35 blur-md mix-blend-multiply`}
            style={{ animation: "huntPulse 2.4s cubic-bezier(.22,.61,.36,1) infinite" }}
            aria-hidden
          />
          {/* CORE */}
          <div className={`${section.color} w-7 h-7 rounded-full shadow-lg`} title={section.name} />
          {/* LABEL */}
          <div className="mt-1 rounded-full bg-white/85 backdrop-blur px-2 py-0.5 text-xs font-medium text-gray-800 border">
            {section.name}
          </div>
        </div>
          )
        })()}
      </div>
    </div>

            {currentItem && (
              <p className="text-sm text-center text-gray-600">
                Glowing dot marks the location for this item: <span className="font-semibold">{currentItem.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
  @keyframes huntPulse {
    0%   { transform: scale(0.8); opacity: .55; }
    70%  { transform: scale(2.2); opacity: 0;   }
    100% { opacity: 0; }
  }
`}</style>

    </div>
  )
  
}
