"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { fetchCycles } from "@/lib/api/cycles"
import { fetchApplications } from "@/lib/api/applications"
import { fetchUsers } from "@/lib/api/users"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCycles: 0,
    activeCycles: 0,
    totalApplications: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cycles, applications, users] = await Promise.all([fetchCycles(), fetchApplications(), fetchUsers()])

        setStats({
          totalCycles: cycles.length,
          activeCycles: cycles.filter((c) => c.status === "active").length,
          totalApplications: applications.length,
          totalUsers: users.length,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <ProtectedRoute requiredRole="super_admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading statistics...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Cycles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCycles}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stats.activeCycles} active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalApplications}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all cycles</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Operational</div>
                    <p className="text-xs text-muted-foreground mt-1">All systems running</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common admin tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/dashboard/cycles/new" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Create Recruitment Cycle
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/users/new" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Add Team Member
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/users" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/audit-logs" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        View Audit Logs
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recruitment</CardTitle>
                    <CardDescription>Manage cycles and applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        View All Cycles
                      </Button>
                    </Link>
                    <Link href="/dashboard/campaigns" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Email Campaigns
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System</CardTitle>
                    <CardDescription>Configuration and monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                      Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                      Backups
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
