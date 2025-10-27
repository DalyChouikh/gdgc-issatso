"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, FileText, LogOut, Mail, Settings, Users, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/use-auth"
import { canAccess } from "@/lib/auth/rbac"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  if (!user) return null

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            GDG
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">GDG Recruitment</span>
            <span className="text-xs text-muted-foreground">Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
              <Link href="/dashboard">
                <BarChart3 className="size-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Recruitment Cycles */}
          {canAccess(user.role, "manage_cycles") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/cycles")} tooltip="Cycles">
                <Link href="/dashboard/cycles">
                  <Calendar className="size-4" />
                  <span>Recruitment Cycles</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Applications */}
          {canAccess(user.role, "review_applications") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/applications")} tooltip="Applications">
                <Link href="/dashboard/applications">
                  <FileText className="size-4" />
                  <span>Applications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Interviews */}
          {canAccess(user.role, "manage_interviews") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/interviews")} tooltip="Interviews">
                <Link href="/dashboard/interviews">
                  <Zap className="size-4" />
                  <span>Interviews</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Email Campaigns */}
          {canAccess(user.role, "manage_campaigns") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/campaigns")} tooltip="Campaigns">
                <Link href="/dashboard/campaigns">
                  <Mail className="size-4" />
                  <span>Email Campaigns</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Admin Section */}
          {canAccess(user.role, "manage_users") && (
            <>
              <SidebarSeparator className="my-2" />
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/admin")} tooltip="Admin">
                  <Link href="/dashboard/admin">
                    <Settings className="size-4" />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive("/dashboard/admin/users")}>
                      <Link href="/dashboard/admin/users">
                        <Users className="size-4" />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive("/dashboard/admin/audit-logs")}>
                      <Link href="/dashboard/admin/audit-logs">
                        <BarChart3 className="size-4" />
                        <span>Audit Logs</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2 px-2 py-2">
              <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 size-4" />
                Sign Out
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
