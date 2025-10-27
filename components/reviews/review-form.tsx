"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewFormProps {
  onSubmit: (score: number, feedback: string) => Promise<void>
  isLoading?: boolean
}

export function ReviewForm({ onSubmit, isLoading = false }: ReviewFormProps) {
  const [score, setScore] = useState(50)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (score < 0 || score > 100) {
      setError("Score must be between 0 and 100")
      return
    }

    try {
      await onSubmit(score, feedback)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Review</CardTitle>
        <CardDescription>Evaluate this application</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="score" className="text-sm font-medium">
              Score: {score}/100
            </label>
            <input
              id="score"
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Average</span>
              <span>Excellent</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide detailed feedback about this application..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
