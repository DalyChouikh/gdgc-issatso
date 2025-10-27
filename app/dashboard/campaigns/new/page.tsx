"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CampaignForm } from "@/components/email/campaign-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { createCampaign } from "@/lib/api/campaigns"

export default function NewCampaignPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cycleId = searchParams.get("cycleId") || "default-cycle"

  const handleSubmit = async (data: any) => {
    await createCampaign(data)
    router.push("/dashboard/campaigns")
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create Campaign</h1>
            <p className="text-muted-foreground">Set up a new email campaign</p>
          </div>

          <div className="max-w-2xl">
            <CampaignForm cycleId={cycleId} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
