import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServer()
    const { id } = await params

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

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", id)
      .single()

    if (campaignError) throw campaignError
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Get applications based on recipient filter
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("applicant_email, applicant_name")
      .eq("cycle_id", campaign.cycle_id)

    if (appsError) throw appsError

    // Create email logs for each recipient
    const emailLogs = applications.map((app) => ({
      campaign_id: id,
      recipient_email: app.applicant_email,
      subject: campaign.subject,
      status: "sent",
      sent_at: new Date().toISOString(),
    }))

    const { error: logsError } = await supabase.from("email_logs").insert(emailLogs)

    if (logsError) throw logsError

    // Update campaign status
    const { error: updateError } = await supabase
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${applications.length} recipients`,
    })
  } catch (error) {
    console.error("[Error] Error sending campaign:", error)
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 })
  }
}
