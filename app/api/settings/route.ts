import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord } from "@/lib/pocketbase";
import { validateSettingsInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedRequest(req);
  if (!isAuth) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in as an administrator." },
      { status: 401 }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = validateSettingsInput(rawBody);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { id, name, tagline, description, ideal_customer_profile, value_propositions, keywords } =
      validation.data;

    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    const updated = await pb.collection("products").update<ProductRecord>(id, {
      name,
      tagline,
      description,
      ideal_customer_profile,
      value_propositions,
      keywords,
    });

    return NextResponse.json({
      success: true,
      message: "Product settings updated successfully.",
      product: updated,
    });
  } catch (err: any) {
    console.error("[API /settings] Update error:", err);
    return NextResponse.json(
      { error: "Failed to update product settings. Please check server logs." },
      { status: 500 }
    );
  }
}
