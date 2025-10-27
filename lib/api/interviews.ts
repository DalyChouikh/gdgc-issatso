export interface Interview {
  id: string
  application_id: string
  interviewer_id: string
  scheduled_at: string
  duration_minutes: number
  meeting_link: string | null
  notes: string | null
  status: "scheduled" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export async function fetchInterviews(applicationId?: string, cycleId?: string): Promise<Interview[]> {
  const url = new URL("/api/interviews", window.location.origin)
  if (applicationId) url.searchParams.append("applicationId", applicationId)
  if (cycleId) url.searchParams.append("cycleId", cycleId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch interviews")
  return response.json()
}

export async function fetchInterview(id: string): Promise<Interview> {
  const response = await fetch(`/api/interviews/${id}`)
  if (!response.ok) throw new Error("Failed to fetch interview")
  return response.json()
}

export async function createInterview(data: Omit<Interview, "id" | "created_at" | "updated_at">): Promise<Interview> {
  const response = await fetch("/api/interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create interview")
  return response.json()
}

export async function updateInterview(id: string, data: Partial<Interview>): Promise<Interview> {
  const response = await fetch(`/api/interviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update interview")
  return response.json()
}

export async function deleteInterview(id: string): Promise<void> {
  const response = await fetch(`/api/interviews/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete interview")
}
