import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const cycleId = searchParams.get("cycleId")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase.from("availability_slots").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (cycleId) {
      query = query.eq("cycle_id", cycleId)
    }

    const { data: slots, error } = await query.order("start_time", { ascending: true })

    if (error) throw error

    return NextResponse.json(slots)
  } catch (error) {
    console.error("[Error] Error fetching availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
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

    const body = await request.json()
    const { cycle_id, start_time, end_time } = body

    const { data: slot, error } = await supabase
      .from("availability_slots")
      .insert({
        user_id: user.id,
        cycle_id,
        start_time,
        end_time,
        is_available: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating availability:", error)
    return NextResponse.json({ error: "Failed to create availability" }, { status: 500 })
  }
}
