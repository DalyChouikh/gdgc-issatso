"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchCampaign, sendCampaign, type EmailCampaign } from "@/lib/api/campaigns"
import { fetchEmailLogs, type EmailLog } from "@/lib/api/email-logs"

export default function CampaignDetailPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<EmailCampaign | null>(null)
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [campaignData, logsData] = await Promise.all([fetchCampaign(campaignId), fetchEmailLogs(campaignId)])
        setCampaign(campaignData)
        setLogs(logsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaign")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [campaignId])

  const handleSendCampaign = async () => {
    setSending(true)
    try {
      await sendCampaign(campaignId)
      const campaignData = await fetchCampaign(campaignId)
      const logsData = await fetchEmailLogs(campaignId)
      setCampaign(campaignData)
      setLogs(logsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send campaign")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading campaign...</p>
        </main>
      </ProtectedRoute>
    )
  }

  if (error || !campaign) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
              {error || "Campaign not found"}
            </div>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    sent: "bg-green-100 text-green-800",
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            Back to Campaigns
          </Button>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription>{campaign.subject}</CardDescription>
                    </div>
                    <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: campaign.template_html }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Logs ({logs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No emails sent yet</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                          <div className="text-sm">
                            <p className="font-medium">{log.recipient_email}</p>
                            <p className="text-xs text-muted-foreground">{log.status}</p>
                          </div>
                          <Badge variant="outline">{log.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {campaign.status === "draft" && (
                    <Button onClick={handleSendCampaign} className="w-full" disabled={sending}>
                      {sending ? "Sending..." : "Send Campaign"}
                    </Button>
                  )}
                  {campaign.status === "sent" && (
                    <p className="text-sm text-muted-foreground">Campaign has been sent</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
