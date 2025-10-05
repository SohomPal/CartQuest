"use client"

import { useState, useRef } from "react"
import { X, Camera, MapPin, Sparkles } from "lucide-react"
import type { ChallengeItem } from "@/lib/stores"

interface SwipeCardProps {
  item: ChallengeItem
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onMap: () => void
}

export function SwipeCard({ item, onSwipeLeft, onSwipeRight, onMap }: SwipeCardProps) {
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

  const displayPoints = item.isPromo ? item.points * 2 : item.points

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
        <div className="w-full h-full rounded-3xl bg-white shadow-2xl overflow-hidden relative">
          {/* Diagonal pattern overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                var(--store-gradient-from),
                var(--store-gradient-from) 10px,
                transparent 10px,
                transparent 20px
              )`,
            }}
          />

          {/* Item Image Section */}
          <div className="h-2/3 bg-gradient-to-br from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] flex items-center justify-center relative">
            {item.isPromo && (
              <div className="absolute top-6 right-6 z-20">
                <div className="relative">
                  <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-900 px-5 py-2.5 rounded-lg font-black text-sm shadow-xl border-2 border-amber-600">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>2× POINTS</span>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-amber-600" />
                </div>
              </div>
            )}

            <div className="text-white text-center p-8 relative z-10">
              <div className="w-40 h-40 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <span className="text-7xl">🛒</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-balance drop-shadow-lg">{item.name}</h2>
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                {item.category}
              </div>
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-5 py-2.5 shadow-lg">
                <span className="text-2xl font-black">+{displayPoints}</span>
                <span className="text-lg font-bold">pts</span>
              </div>
            </div>

            {/* Swipe Indicators */}
            {dragOffset.x < -50 && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-sm">
                <div className="w-32 h-32 rounded-full border-8 border-red-500 flex items-center justify-center rotate-12 bg-white/10">
                  <X className="w-16 h-16 text-red-500" strokeWidth={3} />
                </div>
              </div>
            )}
            {dragOffset.x > 50 && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center -rotate-12 bg-white/10">
                  <Camera className="w-16 h-16 text-green-500" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="h-1/3 p-6 flex flex-col justify-between bg-white">
            <div>
              <p className="text-sm text-gray-600 text-center font-medium">Swipe left to skip • Swipe right to scan</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMap()
                }}
                className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="View store map"
              >
                <MapPin className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSwipeLeft()
                }}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Skip item"
              >
                <X className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSwipeRight()
                }}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Scan barcode"
              >
                <Camera className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
