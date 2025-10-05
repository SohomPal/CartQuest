"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SwipeCard } from "@/components/swipe-card"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { StoreMap } from "@/components/store-map"
import { Confetti } from "@/components/confetti"
import { mockChallenges } from "@/lib/stores"
import { useStore, type CartItem } from "@/lib/store-context"

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useStore()
  const [challenge, setChallenge] = useState(() => {
    const foundChallenge = mockChallenges.find((c) => c.id === params.id)
    if (!foundChallenge) return null
    const totalPotential = foundChallenge.items.reduce(
      (sum, item) => sum + (item.isPromo ? item.points * 2 : item.points),
      0,
    )
    return { ...foundChallenge, earnedPoints: 0, potentialPoints: totalPotential }
  })
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [scannedItems, setScannedItems] = useState<string[]>([])
  const [skippedItems, setSkippedItems] = useState<string[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [consecutiveScans, setConsecutiveScans] = useState(0)
  const [showComboBonus, setShowComboBonus] = useState(false)
  const [skipPenalty, setSkipPenalty] = useState<number | null>(null)
  const [pointsToast, setPointsToast] = useState<number | null>(null)

  useEffect(() => {
    if (challengeComplete) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          handleChallengeComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [challengeComplete])

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Challenge not found</p>
      </div>
    )
  }

  const currentItem = challenge.items[currentItemIndex]
  const progress = ((currentItemIndex / challenge.items.length) * 100).toFixed(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSwipeLeft = () => {
    const itemPoints = currentItem.isPromo ? currentItem.points * 2 : currentItem.points
    setSkipPenalty(itemPoints)
    setChallenge((prev) => (prev ? { ...prev, potentialPoints: prev.potentialPoints - itemPoints } : null))
    setConsecutiveScans(0)
    setSkippedItems((prev) => [...prev, currentItem.id])

    setTimeout(() => setSkipPenalty(null), 1500)

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

    const itemPoints = currentItem.isPromo ? currentItem.points * 2 : currentItem.points

    setChallenge((prev) =>
      prev
        ? {
            ...prev,
            earnedPoints: prev.earnedPoints + itemPoints,
            potentialPoints: prev.potentialPoints,
          }
        : null,
    )

    setPointsToast(itemPoints)
    setTimeout(() => setPointsToast(null), 2000)

    const newConsecutive = consecutiveScans + 1
    setConsecutiveScans(newConsecutive)

    if (newConsecutive % 3 === 0) {
      setShowComboBonus(true)
      setChallenge((prev) => (prev ? { ...prev, earnedPoints: prev.earnedPoints + 10 } : null))
      setTimeout(() => setShowComboBonus(false), 2000)
    }

    setShowConfetti(true)
    setScannedItems((prev) => [...prev, currentItem.id])

    setTimeout(() => {
      setShowConfetti(false)
      if (currentItemIndex < challenge.items.length - 1) {
        setCurrentItemIndex((prev) => prev + 1)
      } else {
        handleChallengeComplete()
      }
    }, 800)
  }

  const handleChallengeComplete = () => {
    setChallengeComplete(true)
    const cartItems: CartItem[] = challenge.items.map((item) => {
      const isScanned = scannedItems.includes(item.id)
      const isSkipped = skippedItems.includes(item.id)
      const earnedPoints = isScanned ? (item.isPromo ? item.points * 2 : item.points) : 0

      return {
        ...item,
        challengeId: challenge.id,
        challengeName: challenge.title,
        status: isScanned ? "scanned" : "skipped",
        earnedPoints,
      }
    })
    addToCart(cartItems)
  }

  if (challengeComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "var(--store-accent)" }}
      >
        <Confetti trigger={true} />
        <div className="w-full max-w-lg">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden ticket-perforated">
            <div className="absolute top-0 left-0 right-0 h-4 bg-white ticket-edge-top" />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white ticket-edge-bottom" />

            <div className="p-8 pt-12 pb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
                <p className="text-gray-600">Items added to your cart</p>
              </div>

              <div className="space-y-2 mb-8 max-h-64 overflow-y-auto">
                {challenge.items.map((item) => {
                  const isScanned = scannedItems.includes(item.id)
                  const isSkipped = skippedItems.includes(item.id)
                  const itemPoints = item.isPromo ? item.points * 2 : item.points

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${
                        isScanned ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{isScanned ? "✅" : "⏭️"}</span>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isScanned ? (
                          <span className="text-green-600 font-bold text-sm">+{itemPoints} points</span>
                        ) : (
                          <span className="text-gray-400 font-medium text-sm">0 points</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]">
                <p className="text-white/90 text-sm font-medium mb-2">Potential Earnings</p>
                <p className="text-5xl font-bold text-white mb-1">{challenge.earnedPoints}</p>
                <p className="text-white/90 text-lg font-medium">points</p>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/")}
                >
                  Continue Shopping →
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/checkout")}
                >
                  Go to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Confetti trigger={showConfetti} />

      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="container px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <span>
                Item {currentItemIndex + 1} of {challenge.items.length}
              </span>
              <span className="text-gray-400">•</span>
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] shrink-0">
              <Trophy className="h-4 w-4 text-white" />
              <span className="font-bold text-white text-sm whitespace-nowrap">
                {challenge.earnedPoints} / {challenge.potentialPoints}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-300 relative"
                style={{
                  width: `${progress}%`,
                  boxShadow: "0 0 20px rgba(251, 191, 36, 0.6)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {skipPenalty !== null && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-float-up">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            0 points
          </div>
        </div>
      )}

      {pointsToast !== null && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-float-up">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg">
            +{pointsToast} points
          </div>
        </div>
      )}

      {showComboBonus && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg">
            🔥 +10 COMBO BONUS!
          </div>
        </div>
      )}

      <div className="container px-4 py-8">
        <SwipeCard
          item={currentItem}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onMap={() => setMapOpen(true)}
        />
      </div>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanComplete}
        itemName={currentItem.name}
        itemPoints={currentItem.isPromo ? currentItem.points * 2 : currentItem.points}
      />

      <StoreMap isOpen={mapOpen} onClose={() => setMapOpen(false)} challengeItems={challenge.items} />
    </div>
  )
}
