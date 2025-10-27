"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EMAIL_TEMPLATES } from "@/lib/email/templates"

interface CampaignFormProps {
  cycleId: string
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function CampaignForm({ cycleId, onSubmit, isLoading = false }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    template_html: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateSelect = (templateHtml: string) => {
    setFormData((prev) => ({ ...prev, template_html: templateHtml }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.subject || !formData.template_html) {
      setError("Please fill in all fields")
      return
    }

    try {
      await onSubmit({
        cycle_id: cycleId,
        ...formData,
        recipient_filter: {},
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Create a new email campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Campaign Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Shortlist Notification"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Email Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., You've been shortlisted!"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Choose a template or customize your own</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateSelect(template.template)}
                className="w-full text-left p-3 border rounded-md hover:bg-muted transition-colors"
              >
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.subject}</p>
              </button>
            ))}
          </div>

          {formData.template_html && (
            <div className="mt-4 p-4 border rounded-md bg-muted">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.template_html }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
