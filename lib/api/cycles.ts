export interface RecruitmentCycle {
  id: string
  name: string
  description: string | null
  status: "planning" | "active" | "closed" | "completed"
  start_date: string
  end_date: string
  created_by: string
  created_at: string
  updated_at: string
}

export async function fetchCycles(): Promise<RecruitmentCycle[]> {
  const response = await fetch("/api/cycles")
  if (!response.ok) throw new Error("Failed to fetch cycles")
  return response.json()
}

export async function fetchCycle(id: string): Promise<RecruitmentCycle> {
  const response = await fetch(`/api/cycles/${id}`)
  if (!response.ok) throw new Error("Failed to fetch cycle")
  return response.json()
}

export async function createCycle(data: Omit<RecruitmentCycle, "id" | "created_by" | "created_at" | "updated_at">) {
  const response = await fetch("/api/cycles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create cycle")
  return response.json()
}

export async function updateCycle(id: string, data: Partial<RecruitmentCycle>) {
  const response = await fetch(`/api/cycles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update cycle")
  return response.json()
}

export async function deleteCycle(id: string) {
  const response = await fetch(`/api/cycles/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete cycle")
  return response.json()
}
