import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("applicationId")
    const cycleId = searchParams.get("cycleId")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase.from("interviews").select("*")

    if (applicationId) {
      query = query.eq("application_id", applicationId)
    }

    if (cycleId) {
      // Join with applications to filter by cycle
      query = query.in("application_id", supabase.from("applications").select("id").eq("cycle_id", cycleId))
    }

    const { data: interviews, error } = await query.order("scheduled_at", { ascending: true })

    if (error) throw error

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("[Error] Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
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

    if (!userProfile || !["super_admin", "admin", "team_management"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { application_id, interviewer_id, scheduled_at, duration_minutes, meeting_link } = body

    const { data: interview, error } = await supabase
      .from("interviews")
      .insert({
        application_id,
        interviewer_id,
        scheduled_at,
        duration_minutes,
        meeting_link,
        status: "scheduled",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(interview, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating interview:", error)
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 })
  }
}
