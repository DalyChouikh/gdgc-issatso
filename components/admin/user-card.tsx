import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { User } from "@/lib/api/users"

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const roleColors: Record<string, string> = {
    super_admin: "bg-red-100 text-red-800",
    admin: "bg-purple-100 text-purple-800",
    team_management: "bg-blue-100 text-blue-800",
    committee_member: "bg-green-100 text-green-800",
    user: "bg-gray-100 text-gray-800",
  }

  const statusColors = user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{user.full_name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={roleColors[user.role]}>{user.role.replace("_", " ")}</Badge>
            <Badge className={statusColors}>{user.is_active ? "Active" : "Inactive"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm mb-4">
          {user.department && (
            <p>
              <span className="font-medium">Department:</span> {user.department}
            </p>
          )}
          {user.phone && (
            <p>
              <span className="font-medium">Phone:</span> {user.phone}
            </p>
          )}
        </div>
        <Link href={`/dashboard/admin/users/${user.id}`}>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Edit User
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
