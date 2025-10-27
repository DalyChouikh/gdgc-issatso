"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchAuditLogs, type AuditLog } from "@/lib/api/users"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchAuditLogs(100)
        setLogs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit logs")
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [])

  const actionColors: Record<string, string> = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    view: "bg-gray-100 text-gray-800",
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">System activity and changes</p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No audit logs available</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 100 system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between border-b pb-4 last:border-b-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={actionColors[log.action] || "bg-gray-100 text-gray-800"}>
                            {log.action}
                          </Badge>
                          <span className="text-sm font-medium">{log.entity_type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                      </div>
                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <div className="text-xs text-muted-foreground max-w-xs text-right">
                          {Object.keys(log.changes).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
