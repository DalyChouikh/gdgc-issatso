import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permissions
    const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userProfile || !["super_admin", "admin"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let query = supabase.from("email_logs").select("*")

    if (campaignId) {
      query = query.eq("campaign_id", campaignId)
    }

    const { data: logs, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(logs)
  } catch (error) {
    console.error("[Error] Error fetching email logs:", error)
    return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 })
  }
}
