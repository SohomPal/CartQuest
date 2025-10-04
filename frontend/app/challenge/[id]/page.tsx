"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SwipeCard } from "@/components/swipe-card"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { StoreMap } from "@/components/store-map"
import { Confetti } from "@/components/confetti"
import { mockChallenges } from "@/lib/stores"
import { useStore } from "@/lib/store-context"

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const { addPoints } = useStore()
  const [challenge, setChallenge] = useState(mockChallenges.find((c) => c.id === params.id))
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [scannedItems, setScannedItems] = useState<string[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [challengeComplete, setChallengeComplete] = useState(false)

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Challenge not found</p>
      </div>
    )
  }

  const currentItem = challenge.items[currentItemIndex]
  const progress = ((scannedItems.length / challenge.items.length) * 100).toFixed(0)

  const handleSwipeLeft = () => {
    if (currentItemIndex < challenge.items.length - 1) {
      setCurrentItemIndex((prev) => prev + 1)
    } else {
      handleChallengeComplete()
    }
  }

  const handleSwipeRight = () => {
    setScannerOpen(true)
  }

  const handleScanComplete = () => {
    setScannerOpen(false)
    setShowConfetti(true)
    setScannedItems((prev) => [...prev, currentItem.id])

    setTimeout(() => {
      setShowConfetti(false)
      if (currentItemIndex < challenge.items.length - 1) {
        setCurrentItemIndex((prev) => prev + 1)
      } else {
        handleChallengeComplete()
      }
    }, 2000)
  }

  const handleChallengeComplete = () => {
    setChallengeComplete(true)
    addPoints(challenge.points)
  }

  const handleHint = () => {
    setShowHint(true)
    setTimeout(() => setShowHint(false), 3000)
  }

  if (challengeComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Confetti trigger={true} />
        <div className="text-center space-y-6 max-w-md">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] flex items-center justify-center">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-balance">Challenge Complete!</h1>
          <p className="text-xl text-muted-foreground">
            You collected {scannedItems.length} out of {challenge.items.length} items
          </p>
          <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            +{challenge.points} points
          </div>
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white"
              onClick={() => router.push(`/checkout/${challenge.id}`)}
            >
              Proceed to Checkout
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={() => router.push("/")}>
              Back to Challenges
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Confetti trigger={showConfetti} />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {currentItemIndex + 1} / {challenge.items.length}
                </span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
              <Trophy className="h-4 w-4 text-white" />
              <span className="font-bold text-white text-sm">{challenge.points}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
          <p className="text-muted-foreground">Swipe to scan or skip items</p>
        </div>

        <SwipeCard
          item={currentItem}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onHint={handleHint}
          onMap={() => setMapOpen(true)}
        />

        {/* Hint Toast */}
        {showHint && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
            <div className="bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg font-medium">
              Look in: {currentItem.location}
            </div>
          </div>
        )}
      </div>

      {/* Barcode Scanner */}
      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanComplete}
        itemName={currentItem.name}
      />

      {/* Store Map */}
      <StoreMap isOpen={mapOpen} onClose={() => setMapOpen(false)} highlightLocation={currentItem.location} />
    </div>
  )
}
