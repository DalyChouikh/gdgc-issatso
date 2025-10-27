"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { InterviewCard } from "@/components/interviews/interview-card"
import { fetchInterviews, type Interview } from "@/lib/api/interviews"
import { fetchApplications, type Application } from "@/lib/api/applications"

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [interviewsData, applicationsData] = await Promise.all([fetchInterviews(), fetchApplications()])
        setInterviews(interviewsData)
        setApplications(applicationsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load interviews")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredInterviews = statusFilter === "all" ? interviews : interviews.filter((i) => i.status === statusFilter)

  const getApplicantName = (applicationId: string) => {
    return applications.find((a) => a.id === applicationId)?.applicant_name || "Unknown"
  }

  return (
    <ProtectedRoute requiredRole="committee_member">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground">Manage and track interview schedules</p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}

          <div className="mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Interviews</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading interviews...</p>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No interviews scheduled</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  applicantName={getApplicantName(interview.application_id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
