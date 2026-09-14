import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { NotificationLogDTO } from "@/dto/NotificationLogDTO";
import { getFirebaseMessaging, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

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

  // Kiểm tra thiết bị iOS (iPhone / iPad)
  isIOS(): boolean {
    if (typeof window === "undefined" || typeof navigator === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  },

  // Kiểm tra xem có đang mở dưới dạng App độc lập (Standalone PWA) không
  isStandalone(): boolean {
    if (typeof window === "undefined") return false;
    return (
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  },

  // Yêu cầu quyền thông báo qua Firebase Cloud Messaging (FCM)
  async requestNotificationPermission(
    options?: string | { orderCode?: string; role?: "ADMIN" | "CUSTOMER" }
  ): Promise<boolean> {
    const orderCode = typeof options === "string" ? options : options?.orderCode;
    const role =
      typeof options === "object" && options?.role
        ? options.role
        : orderCode
        ? "CUSTOMER"
        : "ADMIN";

    if (typeof window === "undefined") {
      return false;
    }

    // Xử lý riêng cho iPhone / iPad
    if (this.isIOS()) {
      if (!this.isStandalone()) {
        alert(
          "📱 Hướng dẫn nhận thông báo trên iPhone:\n\n" +
          "1. Bấm nút Chia sẻ (biểu tượng ô vuông có mũi tên ⎋ ở dưới cùng Safari)\n" +
          "2. Cuộn xuống chọn 'Thêm vào Màn hình chính' (Add to Home Screen)\n" +
          "3. Ra Màn hình chính mở ứng dụng Thái Hương vừa thêm để bấm Bật thông báo nhé!"
        );
        return false;
      }

      if (!("Notification" in window)) {
        alert(
          "⚠️ Thiết bị iPhone của bạn chưa hỗ trợ Web Push. Tính năng này yêu cầu phiên bản iOS 16.4 trở lên."
        );
        return false;
      }
    } else {
      if (!("Notification" in window)) {
        alert("Trình duyệt hiện tại của bạn không hỗ trợ tính năng thông báo đẩy.");
        return false;
      }
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        if (this.isIOS()) {
          alert("Quyền thông báo chưa được cấp. Bạn hãy vào Cài đặt của iPhone > Thông báo > tìm ứng dụng Thái Hương để bật Cho phép nhé!");
        } else {
          alert("Trình duyệt chưa được cấp quyền thông báo. Bạn hãy bấm vào biểu tượng cài đặt/ổ khóa bên cạnh thanh địa chỉ URL để cho phép nhé!");
        }
        return false;
      }

      // Đăng ký FCM Service Worker chạy ngầm
      let swRegistration: ServiceWorkerRegistration | undefined;
      if ("serviceWorker" in navigator) {
        swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("[FCM] Đã đăng ký Service Worker thành công:", swRegistration.scope);
      }

      const messaging = await getFirebaseMessaging();
      if (messaging) {
        const { getToken, onMessage } = await import("firebase/messaging");
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        try {
          const currentToken = await getToken(messaging, {
            vapidKey: vapidKey || undefined,
            serviceWorkerRegistration: swRegistration,
          });

          if (currentToken) {
            console.log("[FCM] Đã nhận Device Token:", currentToken, "Role:", role);
            // Lưu token lên Firestore collection 'fcm_tokens'
            const tokenRef = doc(db, "fcm_tokens", currentToken);
            await setDoc(
              tokenRef,
              {
                token: currentToken,
                role: role,
                orderCode: role === "ADMIN" ? "ALL" : (orderCode || null),
                userAgent: navigator.userAgent,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        } catch (tokenErr) {
          console.warn("[FCM] Lấy token từ Firebase:", tokenErr);
        }

        // Lắng nghe thông báo khi đang mở tab (Foreground)
        onMessage(messaging, (payload) => {
          console.log("[FCM] Nhận thông báo Foreground:", payload);
          const title =
            payload.notification?.title ||
            payload.data?.title ||
            "[Thái Hương] Cập nhật tiến độ";
          const body =
            payload.notification?.body ||
            payload.data?.body ||
            "Có tiến độ mới cho đơn hàng của bạn.";
          this.showBrowserNotification({ title, body });
        });
      }

      return true;
    } catch (err) {
      console.error("[FCM] Lỗi đăng ký thông báo:", err);
      return false;
    }
  },

  // Hiển thị thông báo trên máy tính (Desktop Notification)
  async showBrowserNotification(payload: { title: string; body: string; icon?: string }) {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        // Nếu có Service Worker, dùng registration.showNotification (Chrome ưu tiên cơ chế này)
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && reg.showNotification) {
            await reg.showNotification(payload.title, {
              body: payload.body,
              icon: payload.icon || "/favicon.ico",
              badge: "/favicon.ico",
            });
            return;
          }
        }
      } catch (swErr) {
        console.warn("ServiceWorker showNotification fallback:", swErr);
      }

      try {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/favicon.ico",
        });
      } catch (err) {
        console.error("Browser notification failed:", err);
      }
    }
  },
};
