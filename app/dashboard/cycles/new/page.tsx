"use client"

import { useRouter } from "next/navigation"
import { CycleForm } from "@/components/cycles/cycle-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { createCycle } from "@/lib/api/cycles"

export default function NewCyclePage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    await createCycle(data)
    router.push("/dashboard")
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Cycle</h1>
            <p className="text-muted-foreground">Set up a new recruitment cycle</p>
          </div>

          <div className="max-w-2xl">
            <CycleForm onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
