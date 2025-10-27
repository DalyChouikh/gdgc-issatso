import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Interview } from "@/lib/api/interviews"

interface InterviewCardProps {
  interview: Interview
  applicantName?: string
}

export function InterviewCard({ interview, applicantName }: InterviewCardProps) {
  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const scheduledDate = new Date(interview.scheduled_at)
  const formattedDate = scheduledDate.toLocaleDateString()
  const formattedTime = scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{applicantName || "Interview"}</CardTitle>
            <CardDescription>
              {formattedDate} at {formattedTime}
            </CardDescription>
          </div>
          <Badge className={statusColors[interview.status]}>{interview.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Duration:</span> {interview.duration_minutes} minutes
          </p>
          {interview.meeting_link && (
            <p>
              <span className="font-medium">Meeting:</span>{" "}
              <a
                href={interview.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Join Meeting
              </a>
            </p>
          )}
          {interview.notes && (
            <p>
              <span className="font-medium">Notes:</span> {interview.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
