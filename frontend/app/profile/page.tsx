"use client"

import { Header } from "@/components/header"
import { Trophy, Target, Calendar, Award, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] rounded-lg p-8 text-white shadow-lg mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl border-4 border-white/30">
              👤
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Risha Patel</h1>
              <p className="text-lg opacity-90 mb-3">Member since January 2024</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-semibold">Level 12</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-semibold">15,680 Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[var(--store-primary)]" />
              </div>
              <h3 className="font-semibold text-lg">Challenges</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--store-primary)] mb-1">71</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--store-primary)]" />
              </div>
              <h3 className="font-semibold text-lg">Success Rate</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--store-primary)] mb-1">94%</div>
            <p className="text-sm text-muted-foreground">Completion rate</p>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--store-primary)]" />
              </div>
              <h3 className="font-semibold text-lg">Streak</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--store-primary)] mb-1">12</div>
            <p className="text-sm text-muted-foreground">Days in a row</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border border-border mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-[var(--store-primary)]" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-[var(--store-accent)] border border-[var(--store-primary)]/20">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-semibold text-sm">First Challenge</div>
              <div className="text-xs text-muted-foreground mt-1">Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--store-accent)] border border-[var(--store-primary)]/20">
              <div className="text-4xl mb-2">⚡</div>
              <div className="font-semibold text-sm">Speed Demon</div>
              <div className="text-xs text-muted-foreground mt-1">10 quick wins</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--store-accent)] border border-[var(--store-primary)]/20">
              <div className="text-4xl mb-2">🔥</div>
              <div className="font-semibold text-sm">On Fire</div>
              <div className="text-xs text-muted-foreground mt-1">7 day streak</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--store-accent)] border border-[var(--store-primary)]/20">
              <div className="text-4xl mb-2">💎</div>
              <div className="font-semibold text-sm">Point Master</div>
              <div className="text-xs text-muted-foreground mt-1">10k points</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-dashed border-border opacity-50">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-semibold text-sm">Perfectionist</div>
              <div className="text-xs text-muted-foreground mt-1">Locked</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-dashed border-border opacity-50">
              <div className="text-4xl mb-2">👑</div>
              <div className="font-semibold text-sm">Champion</div>
              <div className="text-xs text-muted-foreground mt-1">Locked</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-dashed border-border opacity-50">
              <div className="text-4xl mb-2">🌟</div>
              <div className="font-semibold text-sm">Legend</div>
              <div className="text-xs text-muted-foreground mt-1">Locked</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background border border-dashed border-border opacity-50">
              <div className="text-4xl mb-2">💫</div>
              <div className="font-semibold text-sm">Ultimate</div>
              <div className="text-xs text-muted-foreground mt-1">Locked</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[var(--store-primary)]" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center text-xl">
                🏆
              </div>
              <div className="flex-1">
                <div className="font-semibold">Completed "Weekend BBQ"</div>
                <div className="text-sm text-muted-foreground">Earned 750 points • 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center text-xl">
                ⭐
              </div>
              <div className="flex-1">
                <div className="font-semibold">Completed "Quick Breakfast Run"</div>
                <div className="text-sm text-muted-foreground">Earned 250 points • 1 day ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center text-xl">
                🎯
              </div>
              <div className="flex-1">
                <div className="font-semibold">Completed "Snack Attack"</div>
                <div className="text-sm text-muted-foreground">Earned 150 points • 2 days ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--store-accent)] flex items-center justify-center text-xl">
                🔥
              </div>
              <div className="flex-1">
                <div className="font-semibold">Unlocked "On Fire" achievement</div>
                <div className="text-sm text-muted-foreground">7 day streak • 3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
