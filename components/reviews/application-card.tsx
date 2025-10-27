import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Application } from "@/lib/api/applications"

interface ApplicationCardProps {
  application: Application
  cycleId: string
}

export function ApplicationCard({ application, cycleId }: ApplicationCardProps) {
  const statusColors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    accepted: "bg-emerald-100 text-emerald-800",
  }

  const submittedDate = new Date(application.created_at).toLocaleDateString()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{application.applicant_name}</CardTitle>
            <CardDescription>{application.applicant_email}</CardDescription>
          </div>
          <Badge className={statusColors[application.status]}>{application.status.replace("_", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm mb-4">
          <p>
            <span className="font-medium">Submitted:</span> {submittedDate}
          </p>
        </div>
        <Link href={`/dashboard/cycles/${cycleId}/applications/${application.id}`}>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Review Application
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
