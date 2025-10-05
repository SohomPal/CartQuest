"use client"

import { X, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"
import Link from "next/link"

interface CartDropdownProps {
  open: boolean
  onClose: () => void
}

export function CartDropdown({ open, onClose }: CartDropdownProps) {
  const { cart, currentStore } = useStore()

  if (!open) return null

  const scannedItems = cart.filter((item) => item.status === "scanned")

  const totalPrice = scannedItems.reduce((sum, item) => sum + item.price, 0)
  const totalPoints = scannedItems.reduce((sum, item) => sum + item.earnedPoints, 0)

  // Group items by challenge
  const itemsByChallenge = scannedItems.reduce(
    (acc, item) => {
      if (!acc[item.challengeId]) {
        acc[item.challengeId] = {
          challengeName: item.challengeName,
          items: [],
        }
      }
      acc[item.challengeId].items.push(item)
      return acc
    },
    {} as Record<string, { challengeName: string; items: typeof scannedItems }>,
  )

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Dropdown Panel */}
      <div className="fixed right-4 top-24 w-96 max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200"
          style={{
            background: `linear-gradient(135deg, ${currentStore.colors.primary} 0%, ${currentStore.colors.primary}dd 100%)`,
          }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-white" />
            <h3 className="font-bold text-white text-lg">Your Cart</h3>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold text-white">
              {scannedItems.length} {scannedItems.length === 1 ? "item" : "items"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/20 text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {scannedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Complete challenges to add items</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(itemsByChallenge).map(([challengeId, { challengeName, items }]) => (
                <div key={challengeId} className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">{challengeName}</h4>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{item.category}</span>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" style={{ color: currentStore.colors.secondary }} />
                            <span className="text-xs font-bold" style={{ color: currentStore.colors.primary }}>
                              +{item.earnedPoints} pts
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {scannedItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" style={{ color: currentStore.colors.secondary }} />
                  Points to Earn
                </span>
                <span className="font-bold" style={{ color: currentStore.colors.primary }}>
                  {totalPoints} pts
                </span>
              </div>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <Button
                className="w-full font-bold text-white shadow-md hover:shadow-lg transition-shadow"
                style={{
                  background: `linear-gradient(135deg, ${currentStore.colors.primary} 0%, ${currentStore.colors.primary}dd 100%)`,
                }}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
