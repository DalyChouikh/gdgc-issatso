export interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface Form {
  id: string
  cycle_id: string
  title: string
  description: string | null
  form_schema: FormField[]
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export async function fetchForms(cycleId?: string): Promise<Form[]> {
  const url = new URL("/api/forms", window.location.origin)
  if (cycleId) url.searchParams.append("cycleId", cycleId)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch forms")
  return response.json()
}

export async function fetchForm(id: string): Promise<Form> {
  const response = await fetch(`/api/forms/${id}`)
  if (!response.ok) throw new Error("Failed to fetch form")
  return response.json()
}

export async function createForm(data: Omit<Form, "id" | "created_by" | "created_at" | "updated_at">) {
  const response = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create form")
  return response.json()
}

export async function updateForm(id: string, data: Partial<Form>) {
  const response = await fetch(`/api/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update form")
  return response.json()
}

export async function deleteForm(id: string) {
  const response = await fetch(`/api/forms/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete form")
  return response.json()
}
