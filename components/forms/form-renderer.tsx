"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormField } from "@/lib/api/forms"

interface FormRendererProps {
  fields: FormField[]
  onSubmit: (responses: Record<string, any>) => Promise<void>
  isLoading?: boolean
  title?: string
  description?: string
}

export function FormRenderer({ fields, onSubmit, isLoading = false, title, description }: FormRendererProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    for (const field of fields) {
      if (field.required && !responses[field.id]) {
        setError(`${field.label} is required`)
        return
      }
    }

    try {
      await onSubmit(responses)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form")
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Application Submitted</h2>
            <p className="text-sm text-muted-foreground">Thank you for your application. We will review it shortly.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={title ? "" : "pt-6"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </label>

              {field.type === "text" && (
                <Input
                  id={field.id}
                  type="text"
                  placeholder={field.placeholder}
                  value={responses[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}

              {field.type === "email" && (
                <Input
                  id={field.id}
                  type="email"
                  placeholder={field.placeholder}
                  value={responses[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={responses[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={4}
                />
              )}

              {field.type === "select" && (
                <select
                  id={field.id}
                  value={responses[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${field.id}-${option}`}
                        value={option}
                        checked={(responses[field.id] || []).includes(option)}
                        onChange={(e) => {
                          const current = responses[field.id] || []
                          const updated = e.target.checked
                            ? [...current, option]
                            : current.filter((o: string) => o !== option)
                          handleChange(field.id, updated)
                        }}
                        className="rounded border-input"
                      />
                      <label htmlFor={`${field.id}-${option}`} className="text-sm">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "radio" && (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`${field.id}-${option}`}
                        name={field.id}
                        value={option}
                        checked={responses[field.id] === option}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="rounded-full border-input"
                      />
                      <label htmlFor={`${field.id}-${option}`} className="text-sm">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
