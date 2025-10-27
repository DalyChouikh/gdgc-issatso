import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const cycleId = searchParams.get("cycleId")
    const formId = searchParams.get("formId")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase.from("applications").select("*")

    if (cycleId) {
      query = query.eq("cycle_id", cycleId)
    }

    if (formId) {
      query = query.eq("form_id", formId)
    }

    const { data: applications, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(applications)
  } catch (error) {
    console.error("[Error] Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const body = await request.json()
    const { form_id, cycle_id, applicant_email, applicant_name, form_responses } = body

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        form_id,
        cycle_id,
        applicant_email,
        applicant_name,
        form_responses,
        status: "submitted",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("[Error] Error creating application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
