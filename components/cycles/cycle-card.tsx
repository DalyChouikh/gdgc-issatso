import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { RecruitmentCycle } from "@/lib/api/cycles"

interface CycleCardProps {
  cycle: RecruitmentCycle
}

export function CycleCard({ cycle }: CycleCardProps) {
  const statusColors: Record<string, string> = {
    planning: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    closed: "bg-yellow-100 text-yellow-800",
    completed: "bg-gray-100 text-gray-800",
  }

  const startDate = new Date(cycle.start_date).toLocaleDateString()
  const endDate = new Date(cycle.end_date).toLocaleDateString()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{cycle.name}</CardTitle>
            <CardDescription>{cycle.description}</CardDescription>
          </div>
          <Badge className={statusColors[cycle.status]}>{cycle.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Start:</span> {startDate}
          </p>
          <p>
            <span className="font-medium">End:</span> {endDate}
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/dashboard/cycles/${cycle.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
