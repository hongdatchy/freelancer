import cron from "node-cron";
import { orderService } from "./order-service";
import { generateMilestoneEmailHtml } from "@/lib/mail-template";
import { getCustomerEmails } from "@/dto/OrderDTO";
import nodemailer from "nodemailer";
import { format, subDays, parseISO } from "date-fns";
import { formatDateVN, subDaysExcludingSunday } from "@/lib/utils";

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
 * - Đại diện Thái Hương: Nhận sớm hơn khách hàng 1 ngày để chủ động chuẩn bị
 * - Khách hàng: Nhận đúng ngày hẹn notifyDate
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

        if (!config || m.status === "COMPLETED") continue;
        // Nếu đã hoàn thành gửi cả 2 bên rồi thì bỏ qua
        if (config.isNotified) continue;

        let milestoneChanged = false;
        const updatedConfig = { ...config };

        const customerNotifyDate = config.notifyDate;
        const thaiHuongNotifyDate =
          config.thaiHuongNotifyDate ||
          (customerNotifyDate ? format(subDaysExcludingSunday(parseISO(customerNotifyDate), 1), "yyyy-MM-dd") : null);

        const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        const trackingBaseUrl = rawBaseUrl.replace(/\/+$/, "");
        const trackingUrl = trackingBaseUrl ? `${trackingBaseUrl}/track/${order.orderCode}` : undefined;

        // ==============================================================
        // LUỒNG 1: THÁI HƯƠNG (Đại diện Thái Hương nhận SỚM HƠN 1 NGÀY)
        // ==============================================================
        const shouldNotifyThaiHuong =
          thaiHuongNotifyDate &&
          thaiHuongNotifyDate <= todayStr &&
          !config.isThaiHuongNotified;

        if (shouldNotifyThaiHuong) {
          console.log(
            `[Cron Worker] Phát hiện mốc cần nhắc NỘI BỘ Thái Hương (trước 1 ngày): Đơn ${order.orderCode} - Mốc #${m.stepNumber}: ${m.title}`
          );

          if (config.sendEmail !== false && transporter && order.thaiHuongPIC?.email) {
            try {
              const thaiHuongMessage =
                `[THÔNG BÁO NỘI BỘ THÁI HƯƠNG - SỚM HƠN KHÁCH HÀNG 1 NGÀY]\n` +
                `Kính gửi bộ phận phụ trách (${order.thaiHuongPIC.name}), mốc "${m.title}" của đơn hàng ${order.orderCode} (${order.productName}) dự kiến sẽ được gửi thông báo tiến độ tới Khách hàng (${order.customer.name}) vào ngày mai (${customerNotifyDate ? formatDateVN(customerNotifyDate) : "sắp tới"}).\n` +
                `Đề nghị Quý phòng ban/Đại diện rà soát kiểm tra kỹ tiến độ, nguyên vật liệu và quy trình sản xuất trước khi hệ thống gửi thông báo cho khách hàng.`;

              const html = generateMilestoneEmailHtml({
                order,
                milestone: m,
                type: "UPCOMING",
                customMessage: thaiHuongMessage,
                trackingUrl,
              });

              await transporter.sendMail({
                from: `"Dược Mỹ Phẩm Thái Hương" <${process.env.SMTP_USER}>`,
                to: order.thaiHuongPIC.email,
                subject: `[Nội Bộ Thái Hương - Nhắc trước 1 ngày] Chuẩn bị tiến độ Mốc #${m.stepNumber}: ${m.title} - Đơn ${order.orderCode}`,
                html,
              });

              console.log(`[Cron Worker] Đã gửi email nội bộ Thái Hương thành công tới: ${order.thaiHuongPIC.email}`);
              sentCount++;
            } catch (mailErr) {
              console.error(`[Cron Worker] Lỗi gửi mail Thái Hương mốc #${m.stepNumber} đơn ${order.orderCode}:`, mailErr);
            }
          }

          updatedConfig.isThaiHuongNotified = true;
          updatedConfig.thaiHuongNotifiedAt = new Date().toISOString();
          milestoneChanged = true;
        }

        // ==============================================================
        // LUỒNG 2: KHÁCH HÀNG (Nhận đúng ngày notifyDate)
        // ==============================================================
        const shouldNotifyCustomer =
          customerNotifyDate &&
          customerNotifyDate <= todayStr &&
          !config.isCustomerNotified;

        if (shouldNotifyCustomer) {
          console.log(
            `[Cron Worker] Phát hiện mốc cần gửi KHÁCH HÀNG: Đơn ${order.orderCode} - Mốc #${m.stepNumber}: ${m.title}`
          );

          const customerEmails = getCustomerEmails(order.customer);

          if (config.sendEmail !== false && transporter && customerEmails.length > 0) {
            try {
              const customerMessage =
                config.customMessage ||
                `Kính gửi Quý Khách hàng, mốc "${m.title}" của đơn hàng ${order.orderCode} (${order.productName}) đang đến hạn triển khai theo đúng kế hoạch sản xuất.`;

              const html = generateMilestoneEmailHtml({
                order,
                milestone: m,
                type: "UPCOMING",
                customMessage: customerMessage,
                trackingUrl,
              });

              await transporter.sendMail({
                from: `"Dược Mỹ Phẩm Thái Hương" <${process.env.SMTP_USER}>`,
                to: customerEmails.join(", "),
                subject: `[Thái Hương] Cập nhật tiến độ Mốc #${m.stepNumber}: ${m.title} - Đơn ${order.orderCode}`,
                html,
              });

              console.log(`[Cron Worker] Đã gửi email khách hàng thành công tới: ${customerEmails.join(", ")}`);
              sentCount++;
            } catch (mailErr) {
              console.error(`[Cron Worker] Lỗi gửi mail khách hàng mốc #${m.stepNumber} đơn ${order.orderCode}:`, mailErr);
            }
          }

          updatedConfig.isCustomerNotified = true;
          updatedConfig.customerNotifiedAt = new Date().toISOString();
          milestoneChanged = true;
        }

        // ==============================================================
        // TỔNG KẾT: Đánh dấu hoàn tất khi cả 2 bên đã được xử lý
        // ==============================================================
        if (updatedConfig.isThaiHuongNotified && updatedConfig.isCustomerNotified) {
          updatedConfig.isNotified = true;
          updatedConfig.lastNotifiedAt = new Date().toISOString();
          milestoneChanged = true;
        }

        if (milestoneChanged) {
          updatedMilestones[i] = {
            ...m,
            notifyConfig: updatedConfig,
          };
          isOrderUpdated = true;
        }
      }

      // Cập nhật lại vào Firestore nếu có mốc vừa được gửi
      if (isOrderUpdated) {
        await orderService.updateOrder(order.id, {
          milestones: updatedMilestones,
        });
        console.log(`[Cron Worker] Đã cập nhật trạng thái thông báo cho đơn: ${order.orderCode}`);
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
