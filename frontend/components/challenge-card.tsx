"use client"

import { useState } from "react"
import { Clock, ChevronDown, ChevronUp, Trophy, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/lib/stores"
import { useRouter } from "next/navigation"

interface ChallengeCardProps {
  challenge: Challenge
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const handleStartChallenge = () => {
    router.push(`/challenge/${challenge.id}`)
  }

  const hasPromoItems = challenge.items.some((item) => item.isPromo)

  return (
    <Card
      className="overflow-hidden rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
      onClick={() => !expanded && setExpanded(true)}
    >
      <div className="h-1.5 bg-gradient-to-r from-[var(--store-primary)] to-[var(--store-secondary)]" />

      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-balance leading-tight">{challenge.title}</h3>
            <p className="text-sm text-muted-foreground text-pretty">{challenge.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-sm font-bold">Up to {challenge.points} pts</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{challenge.timeRemaining} left</span>
            </div>
            {hasPromoItems && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-bold">2× Bonus Items!</span>
              </div>
            )}
          </div>

          {/* Expandable Items List */}
          {expanded && (
            <div className="space-y-3 pt-3 border-t animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Challenge Items ({challenge.items.length})</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(false)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {challenge.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium truncate">{item.name}</span>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <span className={`text-sm font-bold ${item.isPromo ? "text-amber-600" : "text-foreground"}`}>
                        {item.points}
                      </span>
                      {item.isPromo && <span className="text-xs font-bold text-amber-600">×2</span>}
                      <Trophy
                        className={`h-3.5 w-3.5 ml-0.5 ${item.isPromo ? "text-amber-500" : "text-muted-foreground"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-[var(--store-primary)] to-[var(--store-primary)]/85 text-white font-semibold hover:brightness-95 shadow-sm"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartChallenge()
                }}
                disabled={challenge.completed}
              >
                {challenge.completed ? "Completed ✓" : "Accept Challenge →"}
              </Button>
            </div>
          )}

          {!expanded && (
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(true)
              }}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              View Items
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
