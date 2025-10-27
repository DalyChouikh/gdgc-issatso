export interface EmailLog {
  id: string
  campaign_id: string | null
  recipient_email: string
  subject: string
  status: "pending" | "sent" | "failed" | "bounced"
  error_message: string | null
  sent_at: string | null
  created_at: string
}

export async function fetchEmailLogs(campaignId?: string): Promise<EmailLog[]> {
  const url = new URL("/api/email-logs", window.location.origin)
  if (campaignId) url.searchParams.append("campaignId", campaignId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch email logs")
  return response.json()
}
