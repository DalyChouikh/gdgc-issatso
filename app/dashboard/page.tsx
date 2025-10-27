"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CycleCard } from "@/components/cycles/cycle-card"
import { fetchCycles, type RecruitmentCycle } from "@/lib/api/cycles"

export default function DashboardPage() {
  const [cycles, setCycles] = useState<RecruitmentCycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCycles = async () => {
      try {
        const data = await fetchCycles()
        setCycles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cycles")
      } finally {
        setLoading(false)
      }
    }

    loadCycles()
  }, [])

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage recruitment cycles and applications</p>
            </div>
            <Link href="/dashboard/cycles/new">
              <Button>Create New Cycle</Button>
            </Link>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading cycles...</p>
            </div>
          ) : cycles.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground mb-4">No recruitment cycles yet</p>
              <Link href="/dashboard/cycles/new">
                <Button>Create First Cycle</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cycles.map((cycle) => (
                <CycleCard key={cycle.id} cycle={cycle} />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
