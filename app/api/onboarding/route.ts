import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { getPocketBaseUrl, authenticateSuperuser, type UserRecord, type ProductRecord } from "@/lib/pocketbase";
import { getAuthSession, formatOnboardedSetCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getAuthSession(req);
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json(
      { error: "جلسه کاری شما معتبر نیست یا منقضی شده است. لطفاً ابتدا وارد حساب کاربری خود شوید." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, company, role, product_name, product_description, ideal_customer_profile } = body || {};

    // Validate fields
    if (!company || typeof company !== "string" || company.trim().length < 2) {
      return NextResponse.json({ error: "لطفاً نام شرکت یا استارتاپ خود را وارد نمایید (حداقل ۲ کاراکتر)." }, { status: 400 });
    }

    if (!role || typeof role !== "string" || role.trim().length < 2) {
      return NextResponse.json({ error: "لطفاً سمت سازمانی خود را وارد نمایید (حداقل ۲ کاراکتر)." }, { status: 400 });
    }

    if (!product_name || typeof product_name !== "string" || product_name.trim().length < 2) {
      return NextResponse.json({ error: "لطفاً نام محصول یا خدمت اصلی خود را وارد نمایید (حداقل ۲ کاراکتر)." }, { status: 400 });
    }

    if (!product_description || typeof product_description !== "string" || product_description.trim().length < 10) {
      return NextResponse.json(
        { error: "لطفاً شرح مختصر ارزش‌آفرینی محصول را کامل‌تر وارد کنید (حداقل ۱۰ کاراکتر)." },
        { status: 400 }
      );
    }

    if (!ideal_customer_profile || typeof ideal_customer_profile !== "string" || ideal_customer_profile.trim().length < 10) {
      return NextResponse.json(
        { error: "لطفاً مشخصات پرسونای مشتری ایده‌آل (ICP) را با جزئیات بیشتری شرح دهید (حداقل ۱۰ کاراکتر)." },
        { status: 400 }
      );
    }

    const pb = new PocketBase(getPocketBaseUrl());
    await authenticateSuperuser(pb);

    // If regular user (not master admin), update their record in PocketBase users collection
    if (session.user.id !== "admin") {
      const updateData: Partial<UserRecord> = {
        company: company.trim(),
        role: role.trim(),
        product_name: product_name.trim(),
        product_description: product_description.trim(),
        ideal_customer_profile: ideal_customer_profile.trim(),
        onboarding_completed: true,
      };
      if (name && typeof name === "string" && name.trim()) {
        updateData.name = name.trim();
      }

      await pb.collection("users").update(session.user.id, updateData);
    }

    // Also update/sync the product in products collection so the triage pipeline matches this user's product
    try {
      const existingProds = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (existingProds.items.length > 0) {
        const prodId = existingProds.items[0].id;
        await pb.collection("products").update(prodId, {
          name: product_name.trim(),
          description: product_description.trim(),
          ideal_customer_profile: ideal_customer_profile.trim(),
        });
      } else {
        await pb.collection("products").create({
          name: product_name.trim(),
          description: product_description.trim(),
          ideal_customer_profile: ideal_customer_profile.trim(),
          value_propositions: [product_description.trim()],
          keywords: [product_name.trim(), company.trim()],
        });
      }
    } catch (prodErr) {
      console.warn("[Onboarding API] Product sync warning:", prodErr);
      // Non-fatal if product sync has minor schema conflict, user onboarding is primary
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      message: "مشخصات آنبوردینگ با موفقیت ذخیره شد.",
      redirect: "/leads",
    });

    response.headers.append("Set-Cookie", formatOnboardedSetCookie(true, isProd));
    return response;
  } catch (err: any) {
    console.error("[Onboarding API] Save error:", err);
    return NextResponse.json(
      { error: "خطا در ذخیره اطلاعات آنبوردینگ در پایگاه داده. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
