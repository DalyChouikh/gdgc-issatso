"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { CycleForm } from "@/components/cycles/cycle-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { fetchCycle, updateCycle, type RecruitmentCycle } from "@/lib/api/cycles"
import { Button } from "@/components/ui/button"

export default function CycleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const cycleId = params.id as string

  const [cycle, setCycle] = useState<RecruitmentCycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(cycleId)) {
      setError("Invalid cycle ID")
      setLoading(false)
      return
    }

    const loadCycle = async () => {
      try {
        const data = await fetchCycle(cycleId)
        setCycle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cycle")
      } finally {
        setLoading(false)
      }
    }

    loadCycle()
  }, [cycleId])

  const handleSubmit = async (data: any) => {
    await updateCycle(cycleId, data)
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading cycle...</p>
        </main>
      </ProtectedRoute>
    )
  }

  if (error || !cycle) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
              {error || "Cycle not found"}
            </div>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4">
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Edit Cycle</h1>
            <p className="text-muted-foreground">Update recruitment cycle details</p>
          </div>

          <div className="max-w-2xl">
            <CycleForm cycle={cycle} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
