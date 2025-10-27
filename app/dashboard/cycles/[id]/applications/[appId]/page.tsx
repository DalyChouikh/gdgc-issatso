"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ReviewForm } from "@/components/reviews/review-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchApplications, type Application } from "@/lib/api/applications"
import { fetchReviews, createReview, updateApplicationStatus, type Review } from "@/lib/api/reviews"

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cycleId = params.id as string
  const appId = params.appId as string

  const [application, setApplication] = useState<Application | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const apps = await fetchApplications()
        const app = apps.find((a) => a.id === appId)
        if (!app) throw new Error("Application not found")
        setApplication(app)

        const appReviews = await fetchReviews(appId)
        setReviews(appReviews)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load application")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [appId])

  const handleSubmitReview = async (score: number, feedback: string) => {
    setSubmittingReview(true)
    try {
      await createReview({
        application_id: appId,
        score,
        feedback,
        status: "completed",
      })

      // Update application status to under_review
      await updateApplicationStatus(appId, "under_review")

      // Reload reviews
      const appReviews = await fetchReviews(appId)
      setReviews(appReviews)

      // Reload application
      const apps = await fetchApplications()
      const app = apps.find((a) => a.id === appId)
      if (app) setApplication(app)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus)
      const apps = await fetchApplications()
      const app = apps.find((a) => a.id === appId)
      if (app) setApplication(app)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading application...</p>
        </main>
      </ProtectedRoute>
    )
  }

  if (error || !application) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
              {error || "Application not found"}
            </div>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    accepted: "bg-emerald-100 text-emerald-800",
  }

  const averageScore =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1) : null

  return (
    <ProtectedRoute requiredRole="committee_member">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            Back to Applications
          </Button>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{application.applicant_name}</CardTitle>
                      <CardDescription>{application.applicant_email}</CardDescription>
                    </div>
                    <Badge className={statusColors[application.status]}>{application.status.replace("_", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Application Responses</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(application.form_responses).map(([key, value]) => (
                          <div key={key} className="border-b pb-2">
                            <p className="font-medium text-muted-foreground">{key}</p>
                            <p>{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Score: {review.score}/100</p>
                            <Badge variant="outline">{review.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.feedback}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {averageScore && (
                <Card>
                  <CardHeader>
                    <CardTitle>Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageScore}/100</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["submitted", "under_review", "shortlisted", "rejected", "accepted"].map((status) => (
                    <Button
                      key={status}
                      variant={application.status === status ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleStatusChange(status)}
                    >
                      {status.replace("_", " ")}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <ReviewForm onSubmit={handleSubmitReview} isLoading={submittingReview} />
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
