"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserForm } from "@/components/admin/user-form"
import { fetchUser, updateUser, type User } from "@/lib/api/users"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUser(userId)
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [userId])

  const handleSubmit = async (data: any) => {
    await updateUser(userId, data)
    router.push("/dashboard/admin/users")
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="super_admin">
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading user...</p>
        </main>
      </ProtectedRoute>
    )
  }

  if (error || !user) {
    return (
      <ProtectedRoute requiredRole="super_admin">
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
              {error || "User not found"}
            </div>
            <Button onClick={() => router.push("/dashboard/admin/users")}>Back to Users</Button>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="super_admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.push("/dashboard/admin/users")} className="mb-4">
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Update user information and permissions</p>
          </div>

          <div className="max-w-2xl">
            <UserForm user={user} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
