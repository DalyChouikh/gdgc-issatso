"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FormRenderer } from "@/components/forms/form-renderer"
import { fetchForms, type Form } from "@/lib/api/forms"
import { submitApplication } from "@/lib/api/applications"

export default function ApplyPage() {
  const params = useParams()
  const cycleId = params.cycleId as string

  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicantName, setApplicantName] = useState("")
  const [applicantEmail, setApplicantEmail] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const loadForms = async () => {
      try {
        const data = await fetchForms(cycleId)
        const publishedForms = data.filter((f) => f.is_published)
        setForms(publishedForms)

        if (publishedForms.length === 0) {
          setError("No application forms available for this cycle")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load forms")
      } finally {
        setLoading(false)
      }
    }

    loadForms()
  }, [cycleId])

  const handleSubmitApplication = async (formId: string, responses: Record<string, any>) => {
    const applicant_email = applicantEmail // Declare applicant_email variable
    const applicant_name = applicantName // Declare applicant_name variable
    await submitApplication({
      form_id: formId,
      cycle_id: cycleId,
      applicant_email,
      applicant_name,
      form_responses: responses,
      status: "submitted",
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading application forms...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
        </div>
      </main>
    )
  }

  if (!showForm) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Apply Now</h1>
              <p className="text-muted-foreground">Join our community</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <button
                onClick={() => setShowForm(true)}
                disabled={!applicantName || !applicantEmail}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Continue to Application
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Application Form</h1>
          <p className="text-muted-foreground">Applicant: {applicantName}</p>
        </div>

        {forms.map((form) => (
          <FormRenderer
            key={form.id}
            fields={form.form_schema}
            title={form.title}
            description={form.description || undefined}
            onSubmit={(responses) => handleSubmitApplication(form.id, responses)}
          />
        ))}
      </div>
    </main>
  )
}
