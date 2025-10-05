"use client"

import { Header } from "@/components/header"
import { ChallengeCard } from "@/components/challenge-card"
import { mockChallenges } from "@/lib/stores"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchPythonChallenges } from "@/lib/fetchChallenges"

export default function HomePage() {
  const router = useRouter()
  const [remoteChallenges, setRemoteChallenges] = useState<typeof mockChallenges>([])
  const [error, setError] = useState<string | null>(null)
  const localChallenges = mockChallenges.filter(c => ["1", "2", "3"].includes(c.id))
  const allChallenges = [...localChallenges, ...remoteChallenges]

  useEffect(() => {
  let cancelled = false
  fetchPythonChallenges(undefined, ["4","5","6"], "risha123")
    .then(data => { if (!cancelled) setRemoteChallenges(data) })
    .catch(err => { if (!cancelled) setError(err.message) })
  return () => { cancelled = true }
}, [])

  return (
    <div className="min-h-screen bg-[var(--store-bg)]">
      <Header />
      <main>
        <div className="relative overflow-hidden bg-gradient-to-r from-[var(--store-primary)] to-[var(--store-primary)]/85">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="container relative px-4 py-12 md:py-16 text-center max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">🏅 Welcome back, Risha!</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 text-pretty max-w-2xl mx-auto">
              Complete store challenges to earn points & exclusive coupons.
            </p>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => router.push(`/challenge/${allChallenges[0]?.id ?? "1"}`)}
              className="bg-white text-[var(--store-primary)] hover:brightness-95 font-semibold shadow-lg"
            >
              Start Shopping Quests
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3 text-sm">
              Couldn’t load remote challenges (4–6): {error}. Showing local ones only.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
