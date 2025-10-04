import { Header } from "@/components/header"
import { ChallengeCard } from "@/components/challenge-card"
import { mockChallenges } from "@/lib/stores"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] bg-clip-text text-transparent">
            Your Shopping Challenges
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Complete challenges to earn points and unlock rewards. Each challenge is personalized for your store.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </main>
    </div>
  )
}
