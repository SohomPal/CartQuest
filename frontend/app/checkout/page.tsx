"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarcodeDisplay } from "@/components/barcode-display"
import { Confetti } from "@/components/confetti"
import { useStore } from "@/lib/store-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { currentStore, cart, clearCart, getTotalCartPoints, addPoints } = useStore()
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const totalPoints = getTotalCartPoints()
  const scannedItems = cart.filter((item) => item.status === "scanned")
  const skippedItems = cart.filter((item) => item.status === "skipped")

  const barcodeCode = `${currentStore.id.toUpperCase()}CART${Date.now().toString().slice(-6)}`
  const barcodePattern = barcodeCode
    .split("")
    .map((char) => (char.charCodeAt(0) % 2 === 0 ? "1" : "0"))
    .join("")

  const handleCompleteCheckout = () => {
    setShowConfetti(true)
    addPoints(totalPoints)
    setTimeout(() => {
      setCheckoutComplete(true)
      clearCart()
    }, 1500)
  }

  if (cart.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: currentStore.colors.bg }}
      >
        <div className="text-center space-y-4 max-w-md px-4">
          <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Complete some challenges to add items to your cart!</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white"
            onClick={() => router.push("/")}
          >
            Browse Challenges
          </Button>
        </div>
      </div>
    )
  }

  if (checkoutComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: currentStore.colors.bg }}
      >
        <Confetti trigger={true} />
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] flex items-center justify-center shadow-2xl">
            <Sparkles className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-balance">Checkout Complete!</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            You earned <span className="font-bold text-[var(--store-primary)]">{totalPoints} points</span> from your
            shopping!
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white"
              onClick={() => router.push("/")}
            >
              Return Home
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => router.push("/leaderboard")}
            >
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentStore.colors.bg }}>
      <Confetti trigger={showConfetti} />

      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden receipt-card">
          <div className="bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white p-6 text-center">
            <div className="text-4xl mb-2">{currentStore.logo}</div>
            <h2 className="text-2xl font-bold">{currentStore.name}</h2>
            <p className="text-sm opacity-90 mt-1">Self-Checkout Receipt</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Cart Summary</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div
                    key={`${item.challengeId}-${item.id}-${index}`}
                    className={`flex items-center justify-between p-2 rounded-lg border text-sm ${
                      item.status === "scanned" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.status === "scanned" ? "✅" : "⏭️"}</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.challengeName}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${item.status === "scanned" ? "text-green-600" : "text-gray-400"}`}>
                      {item.status === "scanned" ? `+${item.earnedPoints}` : "—"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Scanned items:</span>
                  <span>{scannedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Skipped items:</span>
                  <span>{skippedItems.length}</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Scan at Self-Checkout</h3>
              <p className="text-sm text-muted-foreground">to apply rewards</p>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-border">
              <BarcodeDisplay code={barcodePattern} />
            </div>

            <div className="text-center space-y-1 text-sm">
              <p className="font-mono font-medium">{barcodeCode}</p>
              <p className="text-muted-foreground">Valid for 15 minutes</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 text-center border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">Total Points to Earn</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                +{totalPoints}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white"
              onClick={handleCompleteCheckout}
            >
              Complete Checkout →
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Click after scanning at the self-checkout counter
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
