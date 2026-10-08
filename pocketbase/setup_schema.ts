import PocketBase from "pocketbase";

const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || "";

export async function setupSchema() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "❌ [PocketBase Setup Error] Missing required environment variables:\n" +
        "   POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD must be defined in your .env file."
    );
    process.exit(1);
  }

  console.log(`[PocketBase] Connecting to ${PB_URL}...`);
  const pb = new PocketBase(PB_URL);

  // Authenticate as superuser / admin
  try {
    if (pb.collection("_superusers") && typeof pb.collection("_superusers").authWithPassword === "function") {
      await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    } else if (pb.admins) {
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    }
    console.log("[PocketBase] Superuser authenticated successfully.");
  } catch (err: any) {
    console.error(`[PocketBase] Authentication failed:`, err?.message || err);
    console.log(
      `[PocketBase] Tip: If superuser does not exist, run: ./pocketbase/pocketbase superuser upsert ${ADMIN_EMAIL} <PASSWORD>`
    );
    process.exit(1);
  }

  const existingCollections = await pb.collections.getFullList();
  const getCollection = (name: string) => existingCollections.find((c) => c.name === name);

  // 0. USERS COLLECTION (Auth) - Ensure onboarding and profile fields
  const usersColl = getCollection("users");
  if (usersColl) {
    console.log("[PocketBase] Ensuring 'users' collection has onboarding and multi-tenancy fields...");
    const existingFieldNames = new Set((usersColl.fields as any[]).map((f) => f.name));
    const newOnboardingFields = [
      { name: "company", type: "text", required: false },
      { name: "role", type: "text", required: false },
      { name: "product_name", type: "text", required: false },
      { name: "product_description", type: "text", required: false },
      { name: "ideal_customer_profile", type: "text", required: false },
      { name: "onboarding_completed", type: "bool", required: false },
      {
        name: "plan",
        type: "select",
        values: ["free", "starter", "growth", "enterprise"],
        maxSelect: 1,
        required: false,
      },
      { name: "product_id", type: "text", required: false },
      { name: "has_fetched_initial", type: "bool", required: false },
      { name: "bot_active", type: "bool", required: false },
      { name: "last_bot_run", type: "date", required: false },
    ];
    let updatedFields = [...(usersColl.fields as any[])];
    let fieldsAdded = false;
    for (const f of newOnboardingFields) {
      if (!existingFieldNames.has(f.name)) {
        updatedFields.push(f);
        fieldsAdded = true;
      }
    }
    if (fieldsAdded) {
      await pb.collections.update(usersColl.id, { fields: updatedFields });
      console.log("[PocketBase] Added onboarding & plan fields to 'users' collection.");
    } else {
      console.log("[PocketBase] 'users' collection already has all onboarding & plan fields.");
    }
  }

  // 1. PRODUCTS COLLECTION
  // Hardened: list/view allowed; create/update/delete restricted to superuser (null)
  let productsColl = getCollection("products");
  if (!productsColl) {
    console.log("[PocketBase] Creating 'products' collection...");
    productsColl = await pb.collections.create({
      name: "products",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text", required: true },
        { name: "tagline", type: "text", required: false },
        { name: "description", type: "text", required: true },
        { name: "value_propositions", type: "json", required: false },
        { name: "ideal_customer_profile", type: "text", required: true },
        { name: "keywords", type: "json", required: false },
        {
          name: "user_id",
          type: "relation",
          collectionId: usersColl!.id,
          maxSelect: 1,
          required: false,
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
    });
    console.log("[PocketBase] Created 'products' collection (id: " + productsColl!.id + ")");
  } else {
    console.log("[PocketBase] 'products' collection exists. Enforcing secure access rules...");
    await pb.collections.update(productsColl.id, {
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    try {
      const full = await pb.collections.getOne(productsColl.id);
      const hasUserId = (full.fields as any[]).some((f) => f.name === "user_id");
      if (!hasUserId && usersColl) {
        await pb.collections.update(productsColl.id, {
          fields: [
            ...(full.fields as any[]),
            {
              name: "user_id",
              type: "relation",
              collectionId: usersColl.id,
              maxSelect: 1,
              required: false,
            },
          ],
        });
        console.log("[PocketBase] Migrated 'products' to include 'user_id' relation.");
      }
    } catch (err: any) {
      console.warn("[PocketBase] products user_id migration skipped:", err?.message || err);
    }
  }

  // 2. SOURCES COLLECTION
  // Hardened: list/view allowed; mutations restricted to superuser (null)
  let sourcesColl = getCollection("sources");
  if (!sourcesColl) {
    console.log("[PocketBase] Creating 'sources' collection...");
    sourcesColl = await pb.collections.create({
      name: "sources",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "platform",
          type: "select",
          values: ["telegram", "bale", "twitter_x", "forum"],
          maxSelect: 1,
          required: true,
        },
        {
          name: "status",
          type: "select",
          values: ["active", "paused"],
          maxSelect: 1,
          required: true,
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
    });
    console.log("[PocketBase] Created 'sources' collection (id: " + sourcesColl!.id + ")");
  } else {
    console.log("[PocketBase] 'sources' collection exists. Enforcing secure access rules...");
    await pb.collections.update(sourcesColl.id, {
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
  }

  // 3. RAW_MESSAGES COLLECTION
  // Hardened: list/view allowed (for dashboard count); create/update/delete restricted to superuser (null)
  let rawMessagesColl = getCollection("raw_messages");
  if (!rawMessagesColl) {
    console.log("[PocketBase] Creating 'raw_messages' collection...");
    rawMessagesColl = await pb.collections.create({
      name: "raw_messages",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: "source_id",
          type: "relation",
          collectionId: sourcesColl!.id,
          maxSelect: 1,
          required: false,
        },
        { name: "external_id", type: "text", required: false },
        { name: "author_handle", type: "text", required: true },
        { name: "content", type: "text", required: true },
        { name: "thread_context", type: "text", required: false },
        { name: "posted_at", type: "date", required: false },
        {
          name: "status",
          type: "select",
          values: ["pending", "processed", "filtered", "error"],
          maxSelect: 1,
          required: true,
        },
        {
          name: "user_id",
          type: "relation",
          collectionId: usersColl!.id,
          maxSelect: 1,
          required: false,
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
    });
    console.log("[PocketBase] Created 'raw_messages' collection (id: " + rawMessagesColl!.id + ")");
  } else {
    console.log("[PocketBase] 'raw_messages' collection exists. Enforcing secure access rules...");
    await pb.collections.update(rawMessagesColl.id, {
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    // Migrate the status select to include "filtered" and ensure user_id exists
    try {
      const full = await pb.collections.getOne(rawMessagesColl.id);
      let updatedFields = [...(full.fields as any[])];
      let hasChanges = false;

      const statusField: any = updatedFields.find((f) => f.name === "status");
      if (statusField && Array.isArray(statusField.values) && !statusField.values.includes("filtered")) {
        updatedFields = updatedFields.map((f) =>
          f.name === "status" ? { ...f, values: [...f.values, "filtered"] } : f
        );
        hasChanges = true;
      }

      const hasUserId = updatedFields.some((f) => f.name === "user_id");
      if (!hasUserId && usersColl) {
        updatedFields.push({
          name: "user_id",
          type: "relation",
          collectionId: usersColl.id,
          maxSelect: 1,
          required: false,
        });
        hasChanges = true;
      }

      if (hasChanges) {
        await pb.collections.update(rawMessagesColl.id, { fields: updatedFields });
        console.log("[PocketBase] Migrated 'raw_messages' fields (filtered status / user_id).");
      }
    } catch (err: any) {
      console.warn("[PocketBase] Status migration skipped:", err?.message || err);
    }
  }

  // 4. LEADS COLLECTION
  // Hardened: list/view allowed for dashboard; create/update/delete restricted to superuser (null)
  let leadsColl = getCollection("leads");
  if (!leadsColl) {
    console.log("[PocketBase] Creating 'leads' collection...");
    leadsColl = await pb.collections.create({
      name: "leads",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: "raw_message_id",
          type: "relation",
          collectionId: rawMessagesColl!.id,
          maxSelect: 1,
          required: true,
        },
        {
          name: "product_id",
          type: "relation",
          collectionId: productsColl!.id,
          maxSelect: 1,
          required: true,
        },
        {
          name: "user_id",
          type: "relation",
          collectionId: usersColl!.id,
          maxSelect: 1,
          required: false,
        },
        {
          name: "intent_score",
          type: "number",
          min: 0,
          max: 100,
          required: false,
        },
        {
          name: "intent_level",
          type: "select",
          values: ["high_intent", "problem_aware", "curious", "irrelevant"],
          maxSelect: 1,
          required: true,
        },
        { name: "reasoning", type: "text", required: false },
        { name: "matched_feature", type: "text", required: false },
        { name: "suggested_reply", type: "text", required: false },
        { name: "input_tokens", type: "number", required: false },
        { name: "output_tokens", type: "number", required: false },
        { name: "estimated_cost_usd", type: "number", required: false },
        {
          name: "lead_status",
          type: "select",
          values: ["new", "approved", "contacted", "dismissed"],
          maxSelect: 1,
          required: true,
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
    });
    console.log("[PocketBase] Created 'leads' collection (id: " + leadsColl!.id + ")");
  } else {
    console.log("[PocketBase] 'leads' collection exists. Enforcing secure access rules...");
    await pb.collections.update(leadsColl.id, {
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    // Migrate intent_score to required: false and ensure user_id relation exists
    try {
      const full = await pb.collections.getOne(leadsColl.id);
      let updatedFields = [...(full.fields as any[])];
      let hasChanges = false;

      const scoreField: any = updatedFields.find((f) => f.name === "intent_score");
      if (scoreField && scoreField.required === true) {
        updatedFields = updatedFields.map((f) =>
          f.name === "intent_score" ? { ...f, required: false } : f
        );
        hasChanges = true;
      }

      const hasUserId = updatedFields.some((f) => f.name === "user_id");
      if (!hasUserId && usersColl) {
        updatedFields.push({
          name: "user_id",
          type: "relation",
          collectionId: usersColl.id,
          maxSelect: 1,
          required: false,
        });
        hasChanges = true;
      }

      const hasNotes = updatedFields.some((f) => f.name === "notes");
      if (!hasNotes) {
        updatedFields.push({
          name: "notes",
          type: "text",
          required: false,
        });
        hasChanges = true;
      }

      if (hasChanges) {
        await pb.collections.update(leadsColl.id, { fields: updatedFields });
        console.log("[PocketBase] Migrated 'leads' fields (intent_score required:false / user_id / notes).");
      }
    } catch (err: any) {
      console.warn("[PocketBase] leads migration skipped:", err?.message || err);
    }
  }

  // Ensure default product exists
  const existingProducts = await pb.collection("products").getList(1, 1);
  let defaultProduct;
  if (existingProducts.totalItems === 0) {
    console.log("[PocketBase] Seeding default product (ParsCloud Financials)...");
    defaultProduct = await pb.collection("products").create({
      name: "حساب‌آنلاین پارس (ParsCloud Financials)",
      tagline: "نرم‌افزار یکپارچه حسابداری ابری و صدور خودکار پیش‌فاکتور ریالی، متصل به سامانه مودیان و شبکه بانکی ایران",
      description: "سامانه بومی حسابداری ابری و مدیریت فروش ویژه شرکت‌ها و استارتاپ‌های ایرانی. بدون وابستگی به زیرساخت‌های خارجی و تحریم، با آپتایم ۱۰۰٪ بر بستر شبکه ملی، صدور آنی پیش‌فاکتور و تسویه ریالی خودکار.",
      value_propositions: [
        "اتصال مستقیم، امن و بدون واسطه به سامانه مودیان جهت ارسال خودکار صورتحساب الکترونیکی",
        "سرورهای داخلی مقیم تهران (مرکز داده آسیاتک/ابرآروان) بدون هیچ‌گونه اختلال ناشی از فیلترینگ یا قطعی اینترنت بین‌الملل",
        "صدور پیش‌فاکتور و فاکتور آنلاین همراه با تولید لینک پرداخت ریالی و ارسال پیامکی به مشتری",
        "تعرفه‌گذاری کاملاً ریالی و شفاف متناسب با چرخه اقتصادی کسب‌وکارهای نوپای داخل کشور",
        "ثبت خودکار گردش وجوه و اتصال به کارت‌خوان‌ها و حساب‌های بانکی شتاب",
      ],
      ideal_customer_profile: "استارتاپ‌ها، شرکت‌های بازرگانی و فروشگاه‌های آنلاین فعال در ایران که با تحریم نرم‌افزارهای خارجی (مثل QuickBooks یا Zoho)، قطعی درگاه‌های واسط یا پیچیدگی‌های سامانه مودیان روبرو هستند و به دنبال جایگزین مدرن، ریالی و داخلی می‌گردند.",
      keywords: [
        "حسابداری ابری",
        "سامانه مودیان",
        "صدور پیش‌فاکتور",
        "فاکتور آنلاین",
        "درگاه پرداخت ریالی",
        "جایگزین نرم‌افزار تحریم شده",
        "نرم‌افزار مالی",
        "تسویه خودکار",
        "کارتخوان",
        "اکسل حسابداری",
      ],
    });
    console.log("[PocketBase] Default product created (id: " + defaultProduct.id + ")");
  } else {
    defaultProduct = existingProducts.items[0];
    console.log("[PocketBase] Default product found (id: " + defaultProduct.id + ")");
  }

  // Ensure default sources exist
  const existingSources = await pb.collection("sources").getList(1, 10);
  if (existingSources.totalItems === 0) {
    console.log("[PocketBase] Seeding default domestic community sources...");
    const sampleSources = [
      { name: "Telegram: Iran Tech Founders (گروه استارتاپ‌های ایران)", platform: "telegram", status: "active" },
      { name: "Bale: SME & Commerce Hub (کانال بله کسب‌وکارهای نوین)", platform: "bale", status: "active" },
      { name: "Local Forum: Iranian Devs & Finance (تالار گفتگوی کسب‌وکارهای داخلی)", platform: "forum", status: "active" },
      { name: "Twitter/X: Iran Startup Community (توییتر فارسی اکوسیستم استارتاپی)", platform: "twitter_x", status: "active" },
    ];
    for (const src of sampleSources) {
      await pb.collection("sources").create(src);
    }
    console.log("[PocketBase] Seeded 4 default community sources.");
  } else {
    console.log(`[PocketBase] ${existingSources.totalItems} sources already configured.`);
  }

  console.log("\n=======================================================");
  console.log("🔒 PocketBase Schema Setup & Security Rules Complete!");
  console.log("=======================================================\n");
  return {
    productsCollId: productsColl!.id,
    sourcesCollId: sourcesColl!.id,
    rawMessagesCollId: rawMessagesColl!.id,
    leadsCollId: leadsColl!.id,
    defaultProductId: defaultProduct.id,
  };
}

if ((import.meta as any).main) {
  setupSchema().catch((err) => {
    console.error("[PocketBase] Setup Error:", err);
    process.exit(1);
  });
}
