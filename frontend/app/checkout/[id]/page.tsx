"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ShoppingCart, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarcodeDisplay } from "@/components/barcode-display"
import { Confetti } from "@/components/confetti"
import { mockChallenges } from "@/lib/stores"
import { useStore } from "@/lib/store-context"

export default function CheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { currentStore } = useStore()

  // Parse the cart data from the query parameters
  const cart = JSON.parse(searchParams.get("cart") || "[]")

  const [showBarcode, setShowBarcode] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const challenge = mockChallenges.find((c) => c.id === params.id)

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Challenge not found</p>
      </div>
    )
  }

  // Generate a unique barcode for this checkout
  const barcodeCode = `${currentStore.id.toUpperCase()}${challenge.id}${Date.now().toString().slice(-6)}`
  const barcodePattern = barcodeCode
    .split("")
    .map((char) => (char.charCodeAt(0) % 2 === 0 ? "1" : "0"))
    .join("")

  const handleCheckout = () => {
    setShowBarcode(true)
  }

  const handleCompleteCheckout = () => {
    setShowConfetti(true)
    setTimeout(() => {
      setCheckoutComplete(true)
    }, 2000)
  }

  if (checkoutComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Confetti trigger={true} />
        <div className="text-center space-y-6 max-w-md">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Check className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-balance">Checkout Complete!</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Thank you for shopping with {currentStore.name}. Your points have been added to your account!
          </p>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Challenge Completed
            </span>
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white"
            onClick={() => router.push("/")}
          >
            Back to Challenges
          </Button>
        </div>
      </div>
    )
  }

  if (showBarcode) {
    return (
      <div className="min-h-screen bg-background">
        <Confetti trigger={showConfetti} />

        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
          <div className="container px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setShowBarcode(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Checkout Barcode</h1>
            </div>
          </div>
        </div>

        {/* Barcode Display */}
        <div className="container px-4 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Scan at Self-Checkout</h2>
                  <p className="text-muted-foreground">Present this barcode to complete your purchase</p>
                </div>

                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-border">
                  <BarcodeDisplay code={barcodePattern} />
                </div>

                <div className="space-y-2 text-sm text-center">
                  <p className="font-medium">Barcode ID: {barcodeCode}</p>
                  <p className="text-muted-foreground">Valid for 15 minutes</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                onClick={handleCompleteCheckout}
              >
                <Check className="h-5 w-5 mr-2" />
                Complete Checkout
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

  // Calculate totals
  const subtotal = cart.reduce((sum: any, item: { price: any }) => sum + item.price, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h1 className="text-xl font-bold">Your Cart</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Cart Items */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4">Cart Items</h3>
              <div className="space-y-3">
                {cart.map((item: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: number }) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

       {/* Checkout Button */}
       <Button
            size="lg"
            className="w-30 bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white text-lg py-6"
            onClick={handleCheckout}
          >
            Generate Checkout Barcode
        </Button>

    </div>
  )
}
