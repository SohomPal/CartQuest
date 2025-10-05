"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Sparkles, Tag, Gift, Percent, DollarSign, Check, ArrowLeft } from "lucide-react"
import { Confetti } from "@/components/confetti"
import Link from "next/link"

interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: "percentage" | "brand" | "dollar"
  value: string
  icon: React.ReactNode
  brand?: string
}

const rewards: Reward[] = [
  {
    id: "1",
    title: "5% Off Your Purchase",
    description: "Valid on your next shopping trip",
    pointsCost: 500,
    type: "percentage",
    value: "5%",
    icon: <Percent className="h-6 w-6" />,
  },
  {
    id: "2",
    title: "10% Off Your Purchase",
    description: "Valid on your next shopping trip",
    pointsCost: 1000,
    type: "percentage",
    value: "10%",
    icon: <Percent className="h-6 w-6" />,
  },
  {
    id: "3",
    title: "$5 Off Coca-Cola Products",
    description: "Any Coca-Cola product, any size",
    pointsCost: 300,
    type: "brand",
    value: "$5",
    icon: <Tag className="h-6 w-6" />,
    brand: "Coca-Cola",
  },
  {
    id: "4",
    title: "$3 Off Kellogg's Cereal",
    description: "Any Kellogg's cereal box",
    pointsCost: 200,
    type: "brand",
    value: "$3",
    icon: <Tag className="h-6 w-6" />,
    brand: "Kellogg's",
  },
  {
    id: "5",
    title: "$4 Off Tide Detergent",
    description: "Any Tide laundry detergent",
    pointsCost: 250,
    type: "brand",
    value: "$4",
    icon: <Tag className="h-6 w-6" />,
    brand: "Tide",
  },
  {
    id: "6",
    title: "$10 Off Your Purchase",
    description: "Minimum purchase of $50 required",
    pointsCost: 1500,
    type: "dollar",
    value: "$10",
    icon: <DollarSign className="h-6 w-6" />,
  },
  {
    id: "7",
    title: "$20 Off Your Purchase",
    description: "Minimum purchase of $100 required",
    pointsCost: 2500,
    type: "dollar",
    value: "$20",
    icon: <DollarSign className="h-6 w-6" />,
  },
  {
    id: "8",
    title: "$2 Off Pepsi Products",
    description: "Any Pepsi product, 2-liter or larger",
    pointsCost: 150,
    type: "brand",
    value: "$2",
    icon: <Tag className="h-6 w-6" />,
    brand: "Pepsi",
  },
  {
    id: "9",
    title: "$5 Off Dove Products",
    description: "Any Dove personal care product",
    pointsCost: 300,
    type: "brand",
    value: "$5",
    icon: <Tag className="h-6 w-6" />,
    brand: "Dove",
  },
]

export default function CouponsPage() {
  const { currentStore, userPoints, addPoints } = useStore()
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.pointsCost && !redeemedRewards.includes(reward.id)) {
      addPoints(-reward.pointsCost)
      setRedeemedRewards([...redeemedRewards, reward.id])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const getRewardColor = (type: string) => {
    switch (type) {
      case "percentage":
        return currentStore.colors.primary
      case "brand":
        return currentStore.colors.secondary
      case "dollar":
        return "#10B981"
      default:
        return currentStore.colors.primary
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentStore.colors.bg }}>
      {showConfetti && <Confetti />}

      <div
        className="relative overflow-hidden border-b-4"
        style={{
          background: `linear-gradient(135deg, ${currentStore.colors.primary} 0%, ${currentStore.colors.primary}dd 100%)`,
          borderBottomColor: currentStore.colors.secondary,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
            }}
          />
        </div>

        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: currentStore.colors.secondary, transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: currentStore.colors.secondary, transform: "translate(-30%, 30%)" }}
        />

        <div className="container mx-auto px-4 py-4 relative z-10 max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Challenges</span>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
              >
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Points Redemption</h1>
                <p className="text-sm text-white/90">Turn your points into rewards</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${currentStore.colors.secondary} 0%, ${currentStore.colors.secondary}dd 100%)`,
              }}
            >
              <Sparkles className="h-5 w-5 animate-pulse" style={{ color: currentStore.colors.primary }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: currentStore.colors.primary }}>
                  {userPoints.toLocaleString()}
                </div>
                <div className="text-xs font-medium" style={{ color: currentStore.colors.primary }}>
                  points
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const isRedeemed = redeemedRewards.includes(reward.id)
            const canAfford = userPoints >= reward.pointsCost
            const rewardColor = getRewardColor(reward.type)

            return (
              <div
                key={reward.id}
                className="bg-white rounded-lg overflow-hidden transition-all hover:shadow-xl relative raffle-ticket"
                style={{
                  border: `2px dashed ${rewardColor}`,
                  boxShadow: `0 2px 8px ${rewardColor}20`,
                }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 -ml-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`left-${i}`}
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: currentStore.colors.bg, borderColor: rewardColor }}
                    />
                  ))}
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 -mr-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`right-${i}`}
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: currentStore.colors.bg, borderColor: rewardColor }}
                    />
                  ))}
                </div>

                <div
                  className="h-2 relative"
                  style={{
                    background: `linear-gradient(90deg, ${rewardColor} 0%, ${rewardColor}dd 50%, ${rewardColor} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.3)_10px,rgba(255,255,255,0.3)_20px)]" />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="p-2 rounded-lg border"
                      style={{ backgroundColor: `${rewardColor}10`, borderColor: `${rewardColor}30` }}
                    >
                      <div style={{ color: rewardColor }} className="[&>svg]:h-5 [&>svg]:w-5">
                        {reward.icon}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: rewardColor }}>
                        {reward.value}
                      </div>
                      {reward.brand && (
                        <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">{reward.brand}</div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1">{reward.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{reward.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${currentStore.colors.secondary}40` }}
                    >
                      <Sparkles className="h-3.5 w-3.5" style={{ color: currentStore.colors.primary }} />
                      <span className="text-xs font-bold text-gray-900">{reward.pointsCost.toLocaleString()} pts</span>
                    </div>
                    {isRedeemed && (
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <Check className="h-4 w-4" />
                        <span className="text-xs">Redeemed</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full font-bold transition-all text-sm py-4 rounded-lg"
                    style={{
                      backgroundColor: isRedeemed ? "#10B981" : canAfford ? rewardColor : "#E5E7EB",
                      color: isRedeemed || canAfford ? "white" : "#9CA3AF",
                      boxShadow: isRedeemed || canAfford ? `0 2px 8px ${rewardColor}40` : "none",
                    }}
                    disabled={isRedeemed || !canAfford}
                    onClick={() => handleRedeem(reward)}
                  >
                    {isRedeemed ? "✓ Redeemed!" : canAfford ? "Redeem Now" : "Not Enough Points"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How It Works</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="font-bold" style={{ color: currentStore.colors.primary }}>
                  1.
                </span>
                <span>Complete shopping challenges to earn points</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold" style={{ color: currentStore.colors.primary }}>
                  2.
                </span>
                <span>Browse available rewards and select the ones you want</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold" style={{ color: currentStore.colors.primary }}>
                  3.
                </span>
                <span>Redeem your points and the coupon will be added to your account</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold" style={{ color: currentStore.colors.primary }}>
                  4.
                </span>
                <span>Use your coupons at checkout to save on your purchases</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
