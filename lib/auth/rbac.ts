export type UserRole = "super_admin" | "admin" | "team_management" | "committee_member" | "user"

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 5,
  admin: 4,
  team_management: 3,
  committee_member: 2,
  user: 1,
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    "manage_users",
    "manage_cycles",
    "manage_forms",
    "review_applications",
    "schedule_interviews",
    "send_emails",
    "view_audit_logs",
    "manage_admins",
  ],
  admin: [
    "manage_cycles",
    "manage_forms",
    "review_applications",
    "schedule_interviews",
    "send_emails",
    "view_audit_logs",
  ],
  team_management: ["manage_forms", "review_applications", "schedule_interviews"],
  committee_member: ["review_applications", "schedule_interviews"],
  user: ["submit_application", "view_own_profile"],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessResource(userRole: UserRole, requiredRole: UserRole): boolean {
  return hasRole(userRole, requiredRole)
}

export function canAccess(role: UserRole, permission: string): boolean {
  return hasPermission(role, permission)
}
