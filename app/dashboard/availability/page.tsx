"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/use-auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AvailabilityForm } from "@/components/interviews/availability-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  fetchAvailability,
  createAvailability,
  deleteAvailability,
  type AvailabilitySlot,
} from "@/lib/api/availability"

export default function AvailabilityPage() {
  const { profile } = useAuth()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadSlots = async () => {
      try {
        if (profile?.id) {
          const data = await fetchAvailability(profile.id)
          setSlots(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load availability")
      } finally {
        setLoading(false)
      }
    }

    loadSlots()
  }, [profile?.id])

  const handleAddAvailability = async (startTime: string, endTime: string) => {
    if (!profile?.id) return

    setSubmitting(true)
    try {
      // Get current cycle - for now use a placeholder
      const cycleId = "current-cycle"
      const newSlot = await createAvailability({
        cycle_id: cycleId,
        start_time: startTime,
        end_time: endTime,
      })
      setSlots([...slots, newSlot])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add availability")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await deleteAvailability(slotId)
      setSlots(slots.filter((s) => s.id !== slotId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slot")
    }
  }

  return (
    <ProtectedRoute requiredRole="committee_member">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Availability</h1>
            <p className="text-muted-foreground">Set your available time slots for interviews</p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <AvailabilityForm cycleId="current-cycle" onSubmit={handleAddAvailability} isLoading={submitting} />
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Time Slots</CardTitle>
                  <CardDescription>Manage your available interview times</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading slots...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No availability slots added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {slots.map((slot) => {
                        const startDate = new Date(slot.start_time)
                        const endDate = new Date(slot.end_time)
                        return (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between border-b pb-3 last:border-b-0"
                          >
                            <div className="text-sm">
                              <p className="font-medium">
                                {startDate.toLocaleDateString()}{" "}
                                {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                                {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                              Remove
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
