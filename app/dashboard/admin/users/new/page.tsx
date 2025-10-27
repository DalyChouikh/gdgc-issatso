"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserForm } from "@/components/admin/user-form"
import { createUser } from "@/lib/api/users"

export default function NewUserPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    await createUser(data)
    router.push("/dashboard/admin/users")
  }

  return (
    <ProtectedRoute requiredRole="super_admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.push("/dashboard/admin/users")} className="mb-4">
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold">Add New User</h1>
            <p className="text-muted-foreground">Create a new team member account</p>
          </div>

          <div className="max-w-2xl">
            <UserForm onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
