"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { FormField } from "@/lib/api/forms"

interface FormBuilderProps {
  initialFields?: FormField[]
  onSave: (fields: FormField[]) => Promise<void>
  isLoading?: boolean
}

export function FormBuilder({ initialFields = [], onSave, isLoading = false }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [error, setError] = useState<string | null>(null)

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: "New Field",
      required: false,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await onSave(fields)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-3">
        {fields.map((field) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Label</label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Field label"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FormField["type"] })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Placeholder</label>
                  <Input
                    value={field.placeholder || ""}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    placeholder="Optional placeholder text"
                  />
                </div>

                {["select", "checkbox", "radio"].includes(field.type) && (
                  <div>
                    <label className="text-sm font-medium">Options (comma-separated)</label>
                    <Input
                      value={field.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(field.id, { options: e.target.value.split(",").map((o) => o.trim()) })
                      }
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${field.id}`}
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded border-input"
                  />
                  <label htmlFor={`required-${field.id}`} className="text-sm font-medium">
                    Required
                  </label>
                </div>

                <Button variant="destructive" size="sm" onClick={() => removeField(field.id)}>
                  Remove Field
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addField} variant="outline" className="w-full bg-transparent">
        Add Field
      </Button>

      <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Form"}
      </Button>
    </div>
  )
}
