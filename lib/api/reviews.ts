export interface Review {
  id: string
  application_id: string
  reviewer_id: string
  score: number
  feedback: string | null
  status: "pending" | "completed"
  created_at: string
  updated_at: string
}

export async function fetchReviews(applicationId?: string): Promise<Review[]> {
  const url = new URL("/api/reviews", window.location.origin)
  if (applicationId) url.searchParams.append("applicationId", applicationId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch reviews")
  return response.json()
}

export async function fetchReview(id: string): Promise<Review> {
  const response = await fetch(`/api/reviews/${id}`)
  if (!response.ok) throw new Error("Failed to fetch review")
  return response.json()
}

export async function createReview(data: Omit<Review, "id" | "reviewer_id" | "created_at" | "updated_at" | "status">) {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create review")
  return response.json()
}

export async function updateReview(id: string, data: Partial<Review>) {
  const response = await fetch(`/api/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update review")
  return response.json()
}

export async function deleteReview(id: string) {
  const response = await fetch(`/api/reviews/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete review")
  return response.json()
}

export async function updateApplicationStatus(id: string, status: string) {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error("Failed to update application status")
  return response.json()
}
