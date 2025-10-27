export interface AvailabilitySlot {
  id: string
  user_id: string
  cycle_id: string
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export async function fetchAvailability(userId?: string, cycleId?: string): Promise<AvailabilitySlot[]> {
  const url = new URL("/api/availability", window.location.origin)
  if (userId) url.searchParams.append("userId", userId)
  if (cycleId) url.searchParams.append("cycleId", cycleId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch availability")
  return response.json()
}

export async function createAvailability(
  data: Omit<AvailabilitySlot, "id" | "user_id" | "is_available" | "created_at" | "updated_at">,
): Promise<AvailabilitySlot> {
  const response = await fetch("/api/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create availability")
  return response.json()
}

export async function updateAvailability(id: string, data: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
  const response = await fetch(`/api/availability/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update availability")
  return response.json()
}

export async function deleteAvailability(id: string): Promise<void> {
  const response = await fetch(`/api/availability/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete availability")
}
