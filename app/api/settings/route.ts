import { NextResponse } from "next/server";
import { isAuthenticatedRequest, getAuthSession } from "@/lib/auth";
import { getPocketBaseClient, authenticateSuperuser, type ProductRecord, type UserRecord } from "@/lib/pocketbase";
import { validateSettingsInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedRequest(req);
  const session = await getAuthSession(req);

  if (!isAuth && !session.isAuthenticated) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز. لطفاً وارد حساب کاربری خود شوید." },
      { status: 401 }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = validateSettingsInput(rawBody);

    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: "اعتبارسنجی فیلدها ناموفق بود.", details: validation.errors },
        { status: 400 }
      );
    }

    const { id, name, tagline, description, ideal_customer_profile, value_propositions, keywords } =
      validation.data;

    const pb = getPocketBaseClient();
    await authenticateSuperuser(pb);

    // Verify multi-tenant product ownership if not admin
    if (session.isAuthenticated && session.user && !session.isAdmin) {
      try {
        const existingProd = await pb.collection("products").getOne<ProductRecord>(id);
        if (existingProd.user_id && existingProd.user_id !== session.user.id) {
          return NextResponse.json(
            { error: "شما مجاز به ویرایش این محصول نیستید." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
      }
    }

    const updated = await pb.collection("products").update<ProductRecord>(id, {
      name,
      tagline,
      description,
      ideal_customer_profile,
      value_propositions,
      keywords,
    });

    // Keep user's profile synced in PocketBase
    if (session.isAuthenticated && session.user && !session.isAdmin) {
      try {
        await pb.collection("users").update<UserRecord>(session.user.id, {
          product_name: name,
          product_description: description,
          ideal_customer_profile,
        });
      } catch {
        // non-fatal
      }
    }

    return NextResponse.json({
      success: true,
      message: "تنظیمات محصول با موفقیت در پایگاه داده ذخیره شد.",
      product: updated,
    });
  } catch (err: any) {
    console.error("[API /settings] Update error:", err);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی تنظیمات محصول در دیتابیس." },
      { status: 500 }
    );
  }
}

