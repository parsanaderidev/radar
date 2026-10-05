import { NextResponse } from "next/server";
import { getPocketBaseClient, authenticateSuperuser, type LeadRecord } from "@/lib/pocketbase";
import { validateLeadStatusInput } from "@/lib/validation";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // Rate limit: max 40 status updates per minute per IP
  const rl = rateLimiter.check(`lead-status:${clientIp}`, 40, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": Math.ceil(rl.resetInMs / 1000).toString() } }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = validateLeadStatusInput(rawBody);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: "Invalid payload", details: validation.errors },
        { status: 400 }
      );
    }

    const { leadId, status } = validation.data;

    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    const updated = await pb.collection("leads").update<LeadRecord>(leadId, {
      lead_status: status,
    });

    return NextResponse.json({
      success: true,
      lead: updated,
    });
  } catch (err: any) {
    console.error("[API /leads/status] Update error:", err);
    return NextResponse.json(
      { error: "Failed to update lead status." },
      { status: 500 }
    );
  }
}
