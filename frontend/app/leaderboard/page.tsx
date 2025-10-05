"use client"

import { Header } from "@/components/header"
import { useState } from "react"
import { Trophy, Medal, Award, TrendingUp, Sparkles, Target, Flame } from "lucide-react"
import { useStore } from "@/lib/store-context"

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  challengesCompleted: number
  avatar: string
  trend?: "up" | "down" | "same"
}

const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Risha Makhijani", points: 3120, challengesCompleted: 10, avatar: "👤", trend: "up" },
  { rank: 2, name: "Sarah Chen", points: 2850, challengesCompleted: 12, avatar: "👩", trend: "up" },
  { rank: 3, name: "Mike Coxlong", points: 2640, challengesCompleted: 11, avatar: "👨", trend: "same" },
  { rank: 4, name: "Emily Davis", points: 2180, challengesCompleted: 9, avatar: "👩", trend: "down" },
  { rank: 5, name: "James Wilson", points: 1950, challengesCompleted: 8, avatar: "👨", trend: "up" },
  { rank: 6, name: "Lisa Anderson", points: 1820, challengesCompleted: 8, avatar: "👩", trend: "same" },
  { rank: 7, name: "David Lee", points: 1650, challengesCompleted: 7, avatar: "👨", trend: "up" },
  { rank: 8, name: "Maria Garcia", points: 1480, challengesCompleted: 6, avatar: "👩", trend: "down" },
]

const allTimeLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Mike Johnson", points: 18750, challengesCompleted: 87, avatar: "👨" },
  { rank: 2, name: "Sarah Chen", points: 17920, challengesCompleted: 82, avatar: "👩" },
  { rank: 3, name: "Emily Davis", points: 16340, challengesCompleted: 76, avatar: "👩" },
  { rank: 4, name: "Risha Makhijani", points: 15680, challengesCompleted: 71, avatar: "👤" },
  { rank: 5, name: "James Wilson", points: 14920, challengesCompleted: 68, avatar: "👨" },
  { rank: 6, name: "Lisa Anderson", points: 13850, challengesCompleted: 64, avatar: "👩" },
  { rank: 7, name: "David Lee", points: 12740, challengesCompleted: 59, avatar: "👨" },
  { rank: 8, name: "Maria Garcia", points: 11680, challengesCompleted: 54, avatar: "👩" },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "alltime">("weekly")
  const { currentStore } = useStore()
  const leaderboard = activeTab === "weekly" ? weeklyLeaderboard : allTimeLeaderboard

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentStore.colors.bg }}>
      <Header />
      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8 bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {activeTab === "weekly" ? "Weekly Top Shoppers" : "All-Time Champions"}
            </h1>
          </div>
          <p className="text-center text-lg opacity-90">
            {activeTab === "weekly" ? "See who's leading the pack this week" : "The greatest shoppers of all time"}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Leaderboard */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 bg-surface rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("weekly")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === "weekly"
                    ? "bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveTab("alltime")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === "alltime"
                    ? "bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Time
              </button>
            </div>

            <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 transition-all ${
                    index % 2 === 0 ? "bg-surface" : "bg-background/50"
                  } ${
                    entry.name === "Risha Patel"
                      ? "bg-[var(--store-secondary)]/20 border-l-4 border-[var(--store-secondary)]"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">{getRankIcon(entry.rank)}</div>

                  {/* Avatar */}
                  <div className="text-3xl">{entry.avatar}</div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{entry.name}</h3>
                      {entry.name === "Risha Patel" && (
                        <>
                          <Sparkles className="w-4 h-4 text-[var(--store-secondary)]" />
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--store-primary)] text-white">
                            You
                          </span>
                        </>
                      )}
                      {activeTab === "weekly" && entry.trend && (
                        <TrendingUp
                          className={`w-4 h-4 ${
                            entry.trend === "up"
                              ? "text-green-500"
                              : entry.trend === "down"
                                ? "text-red-500 rotate-180"
                                : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-[var(--store-primary)]">
                        {entry.points.toLocaleString()} pts
                      </span>
                      <span>•</span>
                      <span>{entry.challengesCompleted} challenges</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--store-primary)]" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] rounded-lg text-white">
                  <div className="text-3xl font-bold">{activeTab === "weekly" ? "3,120" : "15,680"}</div>
                  <div className="text-sm opacity-90 mt-1">Current Points</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-[var(--store-primary)]">#1</div>
                    <div className="text-xs text-muted-foreground mt-1">Rank</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-[var(--store-primary)]">
                      {activeTab === "weekly" ? "10" : "71"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Challenges</div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-sm">Current Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">7 days</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-300 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-sm text-yellow-900">Next Reward</span>
                  </div>
                  <div className="text-sm text-yellow-800 mb-2 font-medium">80 points to Gold Badge</div>
                  <div className="w-full bg-yellow-200 rounded-full h-2.5 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full shadow-sm"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
