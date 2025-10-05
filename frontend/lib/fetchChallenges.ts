export async function fetchPythonChallenges(
  baseUrl = process.env.NEXT_PUBLIC_COUPON_API ?? "http://localhost:8000",
  ids = ["4", "5", "6"],
  userId?: string
) {
  const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : ""
  const results = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${baseUrl}/challenges/${id}${qs}`, { cache: "no-store" })
      if (!res.ok) throw new Error(`Failed to fetch challenge ${id}: ${res.status}`)
      return res.json()
    })
  )
  return results as typeof import("@/lib/stores").mockChallenges
}