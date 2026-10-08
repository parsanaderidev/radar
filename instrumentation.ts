export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || !process.env.NEXT_RUNTIME) {
    const { initBackgroundBot } = await import("@/lib/botScheduler");
    // Start background harvester bot (runs every 60 minutes)
    initBackgroundBot(60);
  }
}
