import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { NotificationLogDTO } from "@/dto/NotificationLogDTO";

export interface SendMilestoneNotificationParams {
  order: OrderDTO;
  milestone: MilestoneDTO;
  type: "UPCOMING" | "COMPLETED" | "DELAYED" | "MANUAL_ALERT";
  customMessage?: string;
  trackingBaseUrl?: string;
}

export const notificationService = {
  // Gửi email cho cả 2 bên (Thái Hương PIC và Khách Hàng)
  async sendMilestoneEmail(params: SendMilestoneNotificationParams): Promise<{
    success: boolean;
    message: string;
    log?: NotificationLogDTO;
  }> {
    const { order, milestone, type, customMessage, trackingBaseUrl } = params;
    const trackingUrl = trackingBaseUrl
      ? `${trackingBaseUrl}/track/${order.orderCode}`
      : undefined;

    const recipients = [order.customer.email, order.thaiHuongPIC.email].filter(Boolean);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          milestone,
          type,
          customMessage,
          trackingUrl,
          recipients,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gửi email thất bại");
      }

      // Hiện Browser notification nếu có quyền
      this.showBrowserNotification({
        title: `[Thái Hương] Mốc #${milestone.stepNumber}: ${milestone.title}`,
        body: `Đơn ${order.orderCode} (${order.productName}): ${customMessage || "Đã cập nhật tiến độ."}`,
      });

      return {
        success: true,
        message: `Đã gửi thông báo tới ${recipients.join(", ")}`,
        log: data.log,
      };
    } catch (err: any) {
      console.error("sendMilestoneEmail error:", err);
      return {
        success: false,
        message: err.message || "Không thể gửi email",
      };
    }
  },

  // Yêu cầu quyền thông báo trên trình duyệt
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  },

  // Hiển thị thông báo trên máy tính (Desktop Notification)
  showBrowserNotification(payload: { title: string; body: string; icon?: string }) {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/favicon.ico",
      });
    }
  },
};
