"use client"

import { useState } from "react"
import { Clock, ChevronDown, ChevronUp, Trophy, Sparkles } from "lucide-react"
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

  return (
    <Card
      className={`overflow-hidden border-2 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        challenge.completed ? "opacity-60" : ""
      }`}
      onClick={() => !expanded && setExpanded(true)}
    >
      <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-balance leading-tight mb-2">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{challenge.description}</p>
            </div>
            {challenge.completed && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
              <Trophy className="h-4 w-4 text-white" />
              <span className="font-bold text-white">{challenge.points} pts</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{challenge.timeRemaining}</span>
            </div>
          </div>

          {/* Expandable Items List */}
          {expanded && (
            <div className="space-y-3 pt-4 border-t animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Items to collect ({challenge.items.length})</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(false)
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {challenge.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                      item.isPromo
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.isPromo && <Sparkles className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-sm font-bold ${item.isPromo ? "text-amber-600" : "text-foreground"}`}>
                        {item.points}
                      </span>
                      {item.isPromo && <span className="text-xs font-bold text-amber-600">2x</span>}
                      <Trophy className={`h-3.5 w-3.5 ${item.isPromo ? "text-amber-500" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white font-semibold hover:opacity-90"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartChallenge()
                }}
                disabled={challenge.completed}
              >
                {challenge.completed ? "Completed" : "Start Challenge"}
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
