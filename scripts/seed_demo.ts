import PocketBase from "pocketbase";
import { setupSchema } from "../pocketbase/setup_schema";

export interface DemoMessageDefinition {
  author_handle: string;
  platform: "telegram" | "bale" | "twitter_x" | "forum";
  content: string;
  thread_context?: string;
  category: "high_intent" | "problem_aware" | "noise";
}

export const DEMO_COMMUNITY_MESSAGES: DemoMessageDefinition[] = [
  // ==========================================
  // 5 HIGH-INTENT PERSIAN MESSAGES
  // ==========================================
  {
    author_handle: "@ali_tech_lead",
    platform: "telegram",
    content: "سلام دوستان، استارتاپ ما ماهانه حدود ۳۰۰ تا فاکتور صادر می‌کنه و به شدت دنبال یه سیستم حسابداری آنلاین و ابری هستیم که مستقیماً به سامانه مودیان وصل بشه و لینک پرداخت آنلاین بفرسته. نرم‌افزار معتبر چی پیشنهاد می‌دید؟ بودجه و هزینه اشتراک هم مشکلی نیست.",
    thread_context: "گفتگو پیرامون چالش‌های مالیاتی استارتاپ‌های فین‌تک و خدمات آنلاین در تهران",
    category: "high_intent",
  },
  {
    author_handle: "@shadi_b2b_sales",
    platform: "bale",
    content: "سلام وقت بخیر، دوستان کسی نرم‌افزار صدور پیش‌فاکتور ریالی ابری با قابلیت ارسال پیامک سراغ داره؟ می‌خوایم تیم فروش بتونه سریع با موبایل فاکتور بزنه و تسویه بانکی شتاب رو ردیابی کنه. لطفاً اگر سیستم مطمئنی می‌شناسید معرفی کنید خریداریم.",
    thread_context: "کانال هاب کسب‌وکارهای نوین و تجارت الکترونیک بله",
    category: "high_intent",
  },
  {
    author_handle: "@kamran_cto",
    platform: "forum",
    content: "با توجه به اینکه کوئیک‌بوکز (QuickBooks) و زوهو (Zoho) به خاطر تحریم‌ها دسترسی ما رو قطع کردن، به شدت نیازمند یک جایگزین ابری ایرانی پایدار با سرور داخلی و اتصال مودیان هستیم. کی تجربه کار با سامانه‌های ابری مالی داخلی داره و تعرفه‌اش چطوره؟ فوری نیازمند پیاده‌سازی هستیم.",
    thread_context: "تاپیک: راهکارهای مقابله با مسدودسازی سرویس‌های خارجی مالی در ایران",
    category: "high_intent",
  },
  {
    author_handle: "@reza_tradegroup",
    platform: "telegram",
    content: "دوستان برای شرکت بازرگانی‌مون دنبال یک سامانه جامع حسابداری می‌گردیم که امکان ثبت خودکار گردش وجوه کارت‌خوان، تسویه خودکار و ارسال صورتحساب الکترونیکی رو داشته باشه. دمو یا اکانت آزمایشی از پلتفرم‌های مدرن ایرانی دارین معرفی کنید؟ ممنون میشم.",
    thread_context: "گروه هم‌فکری مدیران بازرگانی و فروش",
    category: "high_intent",
  },
  {
    author_handle: "@sara_founder",
    platform: "twitter_x",
    content: "برای مدیریت مالی فروشگاه و شرکتمون نیاز به یک نرم‌افزار صدور آنلاین فاکتور داریم که بتونه لینک پرداخت اختصاصی بسازه و صورتحساب مودیان رو بدون خطای کارپوشه بفرسته. توسعه‌دهنده‌ها یا بنیان‌گذارها چه پلتفرم پایداری رو پیشنهاد می‌کنید؟",
    thread_context: "توییت در پاسخ به سوال درباره استک ابزارهای ایرانی",
    category: "high_intent",
  },

  // ==========================================
  // 5 PROBLEM-AWARE PERSIAN MESSAGES
  // ==========================================
  {
    author_handle: "@mohsen_finance",
    platform: "telegram",
    content: "از دست سامانه مودیان و خطاهای مداوم کارپوشه خسته شدیم! هر بار یک هفته حسابدار شرکت وقت می‌ذاره تا فاکتورها رو دستی تبدیل کنه و باز هم خطای مغایرت مالیاتی میده. واقعاً راهکار اتوماتیکی نیست که این فاجعه رو جمع کنه؟ کلافه شدیم رسماً.",
    thread_context: "بحث داغ پیرامون جریمه‌های جدید قانون پایانه‌های فروشگاهی و سامانه مودیان",
    category: "problem_aware",
  },
  {
    author_handle: "@mehdi_ecommerce",
    platform: "bale",
    content: "این اکسل دستی حسابداری امون ما رو بریده. دیشب متوجه شدیم به خاطر یک اشتباه فرمول، ۵۰ میلیون تومن فاکتور ماه قبل ثبت نشده و مشتری پرداخت نکرده. کاش یه سیستم ابری بود که خودش یادآوری و لینک تسویه ریالی می‌داد تا انقدر استرس نکشیم.",
    thread_context: "کانال انتقال تجربیات مدیران فروشگاه‌های اینترنتی",
    category: "problem_aware",
  },
  {
    author_handle: "@peyman_devops",
    platform: "forum",
    content: "دیروز دوباره اکانت کلاد یکی دیگه از نرم‌افزارهای خارجی شرکت به خاطر آی‌پی ایران بن شد و کل سوابق مالیاتی ماه گذشته پرید! وابستگی به نرم‌افزارهای خارجی روی سرورهای آلمان و آمریکا تو این شرایط کشور ریسک صددرصده. باید هرچه سریعتر بریم سمت نرم‌افزارهای مقیم داخل.",
    thread_context: "تالار تخصصی زیرساخت و سرورهای داخلی",
    category: "problem_aware",
  },
  {
    author_handle: "@neda_ops",
    platform: "telegram",
    content: "بچه‌ها شما هم با تسویه دیرهنگام درگاه‌های واسط و ثبت دستی رسیدهای کارتخوان توی دفتر حسابداری به مشکل خوردید؟ کارشناس مالیمون روزی ۴ ساعت فقط داره فیش‌های واریزی شتاب رو با فاکتورهای صادر شده مچ می‌کنه و همش اختلاف حساب داریم.",
    thread_context: "گروه تلگرامی عملیات و مدیریت منابع انسانی استارتاپ‌ها",
    category: "problem_aware",
  },
  {
    author_handle: "@pouya_saas",
    platform: "twitter_x",
    content: "توی ایران بیزینس داشتن یعنی ۵۰ درصد وقتت تلف حل کردن اختلالات زیرساختی، قطعی درگاه، فیلترینگ و دستی ثبت کردن فاکتورهای مودیان بشه. وقت و انرژی تیم‌های جوان اینجوری پای بروکراسی هدر میره کاش راهکار مکانیزه‌ای عمومی میشد.",
    thread_context: "رشته‌توییت درباره اصطکاک راه‌اندازی کسب‌وکار در ایران",
    category: "problem_aware",
  },

  // ==========================================
  // 15+ IRRELEVANT / NOISE MESSAGES
  // ==========================================
  {
    author_handle: "@fatemeh_design",
    platform: "telegram",
    content: "سلام صبح همگی بخیر! امیدوارم هفته کاری پر از انرژی و پربرکتی داشته باشید 🌸 چای صبحگاهی فراموش نشه.",
    category: "noise",
  },
  {
    author_handle: "@exchange_updates",
    platform: "telegram",
    content: "قیمت دلار آزاد امروز تو بازار سبزه میدان چند معامله میشه؟ کسی نرخ لحظه‌ای تتر داره؟",
    category: "noise",
  },
  {
    author_handle: "@football_fan_ir",
    platform: "forum",
    content: "دوستان فردا شب بازی ال‌کلاسیکو ساعت چنده دقیقاً؟ از کدوم شبکه تلویزیون یا سایت بدون فیلتر میشه دید؟",
    category: "noise",
  },
  {
    author_handle: "@hr_talents_tehran",
    platform: "telegram",
    content: "به یک نفر کارآموز فرانت‌اند مسلط به React 19 و Next.js و Tailwind CSS به صورت پاره‌وقت در محدوده ونک نیازمندیم. ارسال رزومه به آیدی تلگرام.",
    category: "noise",
  },
  {
    author_handle: "@arash_vpn_seller",
    platform: "telegram",
    content: "کانفیگ اختصاصی V2ray و پروتکل ضد فیلتر پرسرعت تضمینی برای همراه اول و ایرانسل، تست رایگان در پی‌وی!",
    category: "noise",
  },
  {
    author_handle: "@office_buyer",
    platform: "bale",
    content: "دوستان برای اتاق استراحت بچه‌های تیم، قهوه‌ساز خوب زیر ۱۰ میلیون تومن چی پیشنهاد می‌دید بخریم که دوام داشته باشه؟",
    category: "noise",
  },
  {
    author_handle: "@tehran_weather_bot",
    platform: "twitter_x",
    content: "شاخص آلودگی هوای امروز تهران به عدد ۱۶۲ رسید. گروه‌های حساس و سالمندان لطفاً از ترددهای غیرضروری خودداری فرمایند.",
    category: "noise",
  },
  {
    author_handle: "@marketing_boost",
    platform: "telegram",
    content: "فروش ویژه ممبر واقعی و سین کانال با ۵۰ درصد تخفیف ویژه جمعه آخر ماه! جهت سفارش به پی‌وی پیام دهید.",
    category: "noise",
  },
  {
    author_handle: "@saman_ai_enthusiast",
    platform: "forum",
    content: "کسی دوره آموزش هوش مصنوعی و پرامپت نویسی دکتر ربیعی رو ثبت‌نام کرده؟ کیفیت ویدیوها و پروژه‌هاش چطور بوده؟",
    category: "noise",
  },
  {
    author_handle: "@dev_hamid",
    platform: "twitter_x",
    content: "تایپ‌اسکریپت نسخه جدید منتشر شد، قابلیت‌های جدید چک کردن تایپ‌های بازگشتی توابعی واقعاً کار با کتابخونه‌ها رو راحت‌تر کرده.",
    category: "noise",
  },
  {
    author_handle: "@maryam_student",
    platform: "forum",
    content: "درود بر همگی، کسی میدونه پاساژ علاءالدین یا بازار چارسو پنجشنبه‌ها تا چه ساعتی عصرها باز هستن برای خرید لوازم جانبی؟",
    category: "noise",
  },
  {
    author_handle: "@python_coder_99",
    platform: "telegram",
    content: "سلام دوستان برنامه‌نویس، کسی با FastAPI برای سرو کردن مدل‌های یادگیری ماشین تو داکر با پرفورمنس بالا کار کرده یه راهنمایی بکنه؟",
    category: "noise",
  },
  {
    author_handle: "@danial_crypto",
    platform: "bale",
    content: "سکه امامی و طلا دوباره رکورد زدن تو بازار امروز. تحلیل‌گرها هدف بعدی انس طلا رو کجا می‌بینن؟",
    category: "noise",
  },
  {
    author_handle: "@elecomp_visitor",
    platform: "bale",
    content: "آیا کسی لینک ثبت‌نام کارت ورود و غرفه‌داران نمایشگاه الکامپ امسال محل دائمی نمایشگاه‌های تهران رو داره برام بفرسته؟",
    category: "noise",
  },
  {
    author_handle: "@global_nomad_dev",
    platform: "twitter_x",
    content: "Good morning remote workers! Remember to stay hydrated and take a 5-minute break from your screen every hour.",
    category: "noise",
  },
  {
    author_handle: "@behzad_ui_ux",
    platform: "forum",
    content: "دوستان طراح گرافیک، لایسنس فیگما رو چطور بدون کارت اعتباری تمدید می‌کنید این روزها؟ روش مطمئنی سراغ دارید؟",
    category: "noise",
  },
];

export async function seedDemoMessages() {
  const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
  const pb = new PocketBase(PB_URL);

  console.log(`[Seed Demo] Checking PocketBase schema at ${PB_URL}...`);
  await setupSchema();

  // Superuser auth
  const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || "admin@leadradar.local";
  const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || "RadarSecure123456!";
  try {
    if (pb.collection("_superusers") && typeof pb.collection("_superusers").authWithPassword === "function") {
      await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    } else if (pb.admins) {
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    }
  } catch (err: any) {
    console.error("[Seed Demo] Auth error:", err?.message || err);
  }

  // Fetch sources mapping
  const sources = await pb.collection("sources").getFullList();
  const sourceByPlatform: Record<string, string> = {};
  for (const s of sources) {
    sourceByPlatform[s.platform] = s.id;
  }

  console.log(`[Seed Demo] Ingesting ${DEMO_COMMUNITY_MESSAGES.length} community messages...`);

  let count = 0;
  for (const msg of DEMO_COMMUNITY_MESSAGES) {
    const sourceId = sourceByPlatform[msg.platform] || sources[0]?.id;
    await pb.collection("raw_messages").create({
      source_id: sourceId,
      external_id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      author_handle: msg.author_handle,
      content: msg.content,
      thread_context: msg.thread_context || "",
      posted_at: new Date().toISOString(),
      status: "pending",
    });
    count++;
  }

  console.log(`\n=======================================================`);
  console.log(`✅ Successfully seeded ${count} pending community messages!`);
  console.log(`   - 5 High-Intent Persian messages`);
  console.log(`   - 5 Problem-Aware Persian messages`);
  console.log(`   - 16 Irrelevant / Noise messages`);
  console.log(`Run 'bun run scripts/worker.ts' to triage and evaluate.`);
  console.log(`=======================================================\n`);
}

if ((import.meta as any).main) {
  seedDemoMessages().catch((err) => {
    console.error("[Seed Demo] Error:", err);
    process.exit(1);
  });
}
