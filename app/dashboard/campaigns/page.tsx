"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CampaignCard } from "@/components/email/campaign-card"
import { fetchCampaigns, type EmailCampaign } from "@/lib/api/campaigns"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns()
        setCampaigns(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaigns")
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Email Campaigns</h1>
              <p className="text-muted-foreground">Manage recruitment email campaigns</p>
            </div>
            <Link href="/dashboard/campaigns/new">
              <Button>Create Campaign</Button>
            </Link>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground mb-4">No campaigns yet</p>
              <Link href="/dashboard/campaigns/new">
                <Button>Create First Campaign</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
