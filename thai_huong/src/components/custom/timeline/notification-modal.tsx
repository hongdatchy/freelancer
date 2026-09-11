"use client";

import { useState } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO } from "@/dto/MilestoneDTO";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/service/notification-service";
import { Mail, Send, CheckCircle2, User, Building } from "lucide-react";

interface NotificationModalProps {
  order: OrderDTO;
  milestone: MilestoneDTO;
  open: boolean;
  onClose: () => void;
}

export function NotificationModal({
  order,
  milestone,
  open,
  onClose,
}: NotificationModalProps) {
  const [notificationType, setNotificationType] = useState<
    "UPCOMING" | "COMPLETED" | "DELAYED" | "MANUAL_ALERT"
  >("UPCOMING");
  const [customMessage, setCustomMessage] = useState(
    `Kính gửi Quý Khách hàng, mốc "${milestone.title}" của đơn hàng ${order.orderCode} (${order.productName}) đang được chuẩn bị triển khai đúng kế hoạch.`
  );
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const handleSend = async () => {
    setIsSending(true);
    setSendResult(null);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const res = await notificationService.sendMilestoneEmail({
      order,
      milestone,
      type: notificationType,
      customMessage,
      trackingBaseUrl: baseUrl,
    });

    setIsSending(false);
    if (res.success) {
      setSendResult(res.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      alert(res.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Gửi Thông Báo & Email (2 Bên)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Người nhận */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Danh sách nhận thông báo:
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>
                <strong>Thái Hương:</strong> {order.thaiHuongPIC.name} ({order.thaiHuongPIC.email})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                <strong>Khách hàng:</strong> {order.customer.name} ({order.customer.email})
              </span>
            </div>
          </div>

          {/* Loại thông báo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Mục đích thông báo:</label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value as any)}
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UPCOMING">🔔 Nhắc mốc sắp đến hạn (UPCOMING)</option>
              <option value="COMPLETED">✅ Báo hoàn thành mốc (COMPLETED)</option>
              <option value="DELAYED">⚠️ Cảnh báo chậm tiến độ (DELAYED)</option>
              <option value="MANUAL_ALERT">📢 Cập nhật tiến độ đột xuất (MANUAL)</option>
            </select>
          </div>

          {/* Lời nhắn kèm */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Nội dung gửi kèm email:</label>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {sendResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sendResult}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Đóng
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
            {isSending ? "Đang gửi..." : "Gửi Ngay Cho 2 Bên"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
