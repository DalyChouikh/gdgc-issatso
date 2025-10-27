import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const cycleId = searchParams.get("cycleId")

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

    let query = supabase.from("email_campaigns").select("*")

    if (cycleId) {
      query = query.eq("cycle_id", cycleId)
    }

    const { data: campaigns, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("[Error] Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer()

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

    const body = await request.json()
    const { cycle_id, name, subject, template_html, recipient_filter } = body

    const { data: campaign, error } = await supabase
      .from("email_campaigns")
      .insert({
        cycle_id,
        name,
        subject,
        template_html,
        recipient_filter,
        status: "draft",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
