"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AvailabilityFormProps {
  cycleId: string
  onSubmit: (startTime: string, endTime: string) => Promise<void>
  isLoading?: boolean
}

export function AvailabilityForm({ cycleId, onSubmit, isLoading = false }: AvailabilityFormProps) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!startTime || !endTime) {
      setError("Please select both start and end times")
      return
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time")
      return
    }

    try {
      await onSubmit(startTime, endTime)
      setStartTime("")
      setEndTime("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add availability")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Availability</CardTitle>
        <CardDescription>Set your available time slots for interviews</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Time Slot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
