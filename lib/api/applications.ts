export interface Application {
  id: string
  form_id: string
  cycle_id: string
  applicant_email: string
  applicant_name: string
  form_responses: Record<string, any>
  status: "submitted" | "under_review" | "shortlisted" | "rejected" | "accepted"
  created_at: string
  updated_at: string
}

export async function fetchApplications(cycleId?: string, formId?: string): Promise<Application[]> {
  const url = new URL("/api/applications", window.location.origin)
  if (cycleId) url.searchParams.append("cycleId", cycleId)
  if (formId) url.searchParams.append("formId", formId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch applications")
  return response.json()
}

export async function submitApplication(data: Omit<Application, "id" | "created_at" | "updated_at" | "status">) {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to submit application")
  return response.json()
}
