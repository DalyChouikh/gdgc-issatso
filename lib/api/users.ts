export interface User {
  id: string
  email: string
  full_name: string
  role: "super_admin" | "admin" | "team_management" | "committee_member" | "user"
  phone: string | null
  department: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users")
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

export async function createUser(data: Omit<User, "id" | "created_at" | "updated_at" | "avatar_url">): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create user")
  return response.json()
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update user")
  return response.json()
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete user")
}

export interface AuditLog {
  id: string
  user_id: string
  entity_type: string
  entity_id: string
  action: string
  changes: Record<string, any>
  ip_address: string | null
  created_at: string
}

export async function fetchAuditLogs(limit = 50, offset = 0): Promise<AuditLog[]> {
  const url = new URL("/api/audit-logs", window.location.origin)
  url.searchParams.append("limit", limit.toString())
  url.searchParams.append("offset", offset.toString())

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to fetch audit logs")
  return response.json()
}
