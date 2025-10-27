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

    let query = supabase.from("forms").select("*")

    if (cycleId) {
      query = query.eq("cycle_id", cycleId)
    }

    const { data: forms, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(forms)
  } catch (error) {
    console.error("[Error] Error fetching forms:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
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
    const { cycle_id, title, description, form_schema } = body

    const { data: form, error } = await supabase
      .from("forms")
      .insert({
        cycle_id,
        title,
        description,
        form_schema,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating form:", error)
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
  }
}
