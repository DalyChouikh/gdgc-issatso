import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: cycles, error } = await supabase
      .from("recruitment_cycles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(cycles)
  } catch (error) {
    console.error("[Error] Error fetching cycles:", error)
    return NextResponse.json({ error: "Failed to fetch cycles" }, { status: 500 })
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

    // Check if user has permission to create cycles
    const { data: userProfile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userProfile || !["super_admin", "admin"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, start_date, end_date } = body

    const { data: cycle, error } = await supabase
      .from("recruitment_cycles")
      .insert({
        name,
        description,
        start_date,
        end_date,
        created_by: user.id,
        status: "planning",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(cycle, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating cycle:", error)
    return NextResponse.json({ error: "Failed to create cycle" }, { status: 500 })
  }
}
