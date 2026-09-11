import cron from "node-cron";
import { orderService } from "./order-service";
import { generateMilestoneEmailHtml } from "@/lib/mail-template";
import nodemailer from "nodemailer";
import { format } from "date-fns";

let isJobRunning = false;
let cronTask: cron.ScheduledTask | null = null;

// Hàm tạo transporter gửi email SMTP
function createMailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("[Cron Worker] Chưa cấu hình SMTP_USER hoặc SMTP_PASS.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Quét toàn bộ Firestore tìm các mốc đến ngày thông báo để gửi mail tự động
 */
export async function scanAndSendDueReminders() {
  if (isJobRunning) {
    console.log("[Cron Worker] Đang có tiến trình quét chạy, bỏ qua lượt này.");
    return;
  }

  isJobRunning = true;
  const todayStr = format(new Date(), "yyyy-MM-dd");
  console.log(`[Cron Worker] Bắt đầu quét lịch nhắc thông báo cho ngày: ${todayStr}`);

  try {
    const orders = await orderService.getOrders();
    const transporter = createMailTransporter();
    let sentCount = 0;

    for (const order of orders) {
      // Chỉ quét các đơn chưa hoàn tất toàn bộ
      if (order.status === "COMPLETED") continue;

      let isOrderUpdated = false;
      const updatedMilestones = [...order.milestones];

      for (let i = 0; i < updatedMilestones.length; i++) {
        const m = updatedMilestones[i];
        const config = m.notifyConfig;

        // Điều kiện gửi:
        // 1. Có ngày hẹn gửi notifyDate <= ngày hôm nay
        // 2. Chưa gửi (isNotified !== true)
        // 3. Mốc chưa hoàn thành
        if (
          config &&
          config.notifyDate &&
          config.notifyDate <= todayStr &&
          !config.isNotified &&
          m.status !== "COMPLETED"
        ) {
          console.log(
            `[Cron Worker] Phát hiện mốc cần gửi: Đơn ${order.orderCode} - Mốc #${m.stepNumber}: ${m.title}`
          );

          // 1. Gửi Email nếu bật tính năng
          if (config.sendEmail !== false && transporter) {
            const recipients = [order.customer.email, order.thaiHuongPIC.email].filter(Boolean);

            if (recipients.length > 0) {
              try {
                const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
                const trackingBaseUrl = rawBaseUrl.replace(/\/+$/, "");
                const trackingUrl = trackingBaseUrl ? `${trackingBaseUrl}/track/${order.orderCode}` : undefined;

                const customMessage =
                  config.customMessage ||
                  `Kính gửi Quý Khách hàng, mốc "${m.title}" của đơn hàng ${order.orderCode} (${order.productName}) đang đến hạn triển khai theo đúng kế hoạch sản xuất.`;

                const html = generateMilestoneEmailHtml({
                  order,
                  milestone: m,
                  type: "UPCOMING",
                  customMessage,
                  trackingUrl,
                });

                await transporter.sendMail({
                  from: `"Dược Mỹ Phẩm Thái Hương" <${process.env.SMTP_USER}>`,
                  to: recipients.join(", "),
                  subject: `[Thái Hương] Nhắc lịch tiến độ Mốc #${m.stepNumber}: ${m.title} - Đơn ${order.orderCode}`,
                  html,
                });

                console.log(`[Cron Worker] Đã gửi email thành công tới: ${recipients.join(", ")}`);
                sentCount++;
              } catch (mailErr) {
                console.error(`[Cron Worker] Lỗi gửi mail mốc #${m.stepNumber} đơn ${order.orderCode}:`, mailErr);
              }
            }
          }

          // 2. Đánh dấu đã gửi thành công vào cấu hình của mốc
          updatedMilestones[i] = {
            ...m,
            notifyConfig: {
              ...config,
              isNotified: true,
              lastNotifiedAt: new Date().toISOString(),
            },
          };
          isOrderUpdated = true;
        }
      }

      // Cập nhật lại vào Firestore nếu có mốc vừa được gửi
      if (isOrderUpdated) {
        await orderService.updateOrder(order.id, {
          milestones: updatedMilestones,
        });
        console.log(`[Cron Worker] Đã cập nhật trạng thái isNotified cho đơn: ${order.orderCode}`);
      }
    }

    console.log(`[Cron Worker] Hoàn thành lượt quét! Đã gửi ${sentCount} thông báo.`);
  } catch (err) {
    console.error("[Cron Worker] Lỗi trong quá trình quét:", err);
  } finally {
    isJobRunning = false;
  }
}

/**
 * Khởi tạo Background Cron Job chạy trong Node.js của Next.js
 */
export function initReminderCronJob() {
  if (cronTask) {
    console.log("[Cron Worker] Cron job đã được khởi tạo trước đó.");
    return;
  }

  // Lịch chạy: Đúng 08:00 sáng mỗi ngày ('0 8 * * *')
  // Hoặc kiểm tra mỗi tiếng 1 lần ('0 * * * *') để không bỏ sót
  cronTask = cron.schedule("0 8 * * *", async () => {
    console.log("[Cron Worker] Đã đến 08:00 sáng, kích hoạt quét nhắc lịch tự động...");
    await scanAndSendDueReminders();
  });

  console.log("[Cron Worker] ✅ Đã đăng ký cron job nhắc lịch thành công (Lịch: 08:00 sáng hàng ngày).");

  // Kiểm tra bù một lần khi Server vừa khởi động (sau 10 giây để server ổn định kết nối DB)
  setTimeout(() => {
    console.log("[Cron Worker] Chạy quét kiểm tra bù khi Server khởi động...");
    scanAndSendDueReminders();
  }, 10000);
}
