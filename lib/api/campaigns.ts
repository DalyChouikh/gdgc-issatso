export interface EmailCampaign {
  id: string
  cycle_id: string
  name: string
  subject: string
  template_html: string
  recipient_filter: Record<string, any>
  status: "draft" | "scheduled" | "sent"
  scheduled_at: string | null
  sent_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export async function fetchCampaigns(cycleId?: string): Promise<EmailCampaign[]> {
  const url = new URL("/api/campaigns", window.location.origin)
  if (cycleId) url.searchParams.append("cycleId", cycleId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch campaigns")
  return response.json()
}

export async function fetchCampaign(id: string): Promise<EmailCampaign> {
  const response = await fetch(`/api/campaigns/${id}`)
  if (!response.ok) throw new Error("Failed to fetch campaign")
  return response.json()
}

export async function createCampaign(
  data: Omit<EmailCampaign, "id" | "created_by" | "created_at" | "updated_at">,
): Promise<EmailCampaign> {
  const response = await fetch("/api/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create campaign")
  return response.json()
}

export async function updateCampaign(id: string, data: Partial<EmailCampaign>): Promise<EmailCampaign> {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update campaign")
  return response.json()
}

export async function deleteCampaign(id: string): Promise<void> {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete campaign")
}

export async function sendCampaign(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/campaigns/${id}/send`, {
    method: "POST",
  })
  if (!response.ok) throw new Error("Failed to send campaign")
  return response.json()
}
