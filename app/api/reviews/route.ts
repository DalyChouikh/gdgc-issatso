import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("applicationId")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase.from("reviews").select("*")

    if (applicationId) {
      query = query.eq("application_id", applicationId)
    }

    const { data: reviews, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("[Error] Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
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

    if (!userProfile || !["super_admin", "admin", "team_management", "committee_member"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { application_id, score, feedback } = body

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        application_id,
        reviewer_id: user.id,
        score,
        feedback,
        status: "completed",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
