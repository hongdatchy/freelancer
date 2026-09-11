export async function register() {
  // Chỉ chạy ở môi trường Node.js phía server, không chạy ở Edge runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { initReminderCronJob } = await import("@/service/cron-worker");
      initReminderCronJob();
    } catch (err) {
      console.warn("[instrumentation] Không thể khởi động cron worker:", err);
    }
  }
}
