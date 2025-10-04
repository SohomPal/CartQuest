"use client"

import { useState, useRef } from "react"
import { X, Camera, MapPin, HelpCircle } from "lucide-react"
import type { ChallengeItem } from "@/lib/stores"

interface SwipeCardProps {
  item: ChallengeItem
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onHint: () => void
  onMap: () => void
}

export function SwipeCard({ item, onSwipeLeft, onSwipeRight, onHint, onMap }: SwipeCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY })
    setIsDragging(true)
  }

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragStart) return

    const deltaX = clientX - dragStart.x
    const deltaY = clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleDragEnd = () => {
    if (!dragStart) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x < 0) {
        onSwipeLeft()
      } else {
        onSwipeRight()
      }
    }

    setDragStart(null)
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
  }

  const rotation = dragOffset.x * 0.1
  const opacity = 1 - Math.abs(dragOffset.x) / 300

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] perspective-1000">
      <div
        ref={cardRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
          opacity,
          transition: isDragging ? "none" : "all 0.3s ease-out",
        }}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => isDragging && handleDragMove(e.clientX, e.clientY)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => isDragging && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
      >
        <div className="w-full h-full rounded-3xl bg-gradient-to-br from-card to-card/80 border-2 border-border shadow-2xl overflow-hidden">
          {/* Item Image Placeholder */}
          <div className="h-2/3 bg-gradient-to-br from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] flex items-center justify-center relative">
            <div className="text-white text-center p-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-6xl">🛒</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-balance">{item.name}</h2>
              <p className="text-lg text-white/90">{item.category}</p>
            </div>

            {/* Swipe Indicators */}
            {dragOffset.x < -50 && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-red-500 flex items-center justify-center rotate-12">
                  <X className="w-16 h-16 text-red-500" strokeWidth={3} />
                </div>
              </div>
            )}
            {dragOffset.x > 50 && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center -rotate-12">
                  <Camera className="w-16 h-16 text-green-500" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="h-1/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{item.location}</span>
              </div>
              <p className="text-sm text-muted-foreground">Swipe left to skip, swipe right to scan</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMap()
                }}
                className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <MapPin className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSwipeLeft()
                }}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <X className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSwipeRight()
                }}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <Camera className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHint()
                }}
                className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <HelpCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
