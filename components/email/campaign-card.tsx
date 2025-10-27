import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { EmailCampaign } from "@/lib/api/campaigns"

interface CampaignCardProps {
  campaign: EmailCampaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    sent: "bg-green-100 text-green-800",
  }

  const createdDate = new Date(campaign.created_at).toLocaleDateString()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription>{campaign.subject}</CardDescription>
          </div>
          <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm mb-4">
          <p>
            <span className="font-medium">Created:</span> {createdDate}
          </p>
        </div>
        <Link href={`/dashboard/campaigns/${campaign.id}`}>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            View Campaign
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
