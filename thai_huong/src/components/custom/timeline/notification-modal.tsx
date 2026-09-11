"use client";

import { useState } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO, MilestoneNotifyConfig } from "@/dto/MilestoneDTO";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DateInputVN } from "@/components/custom/common/date-input-vn";
import { milestoneService } from "@/service/milestone-service";
import { formatDateVN, formatDateTimeVN } from "@/lib/utils";
import { CalendarClock, Mail, Bell, CheckCircle2, User, Building, Info } from "lucide-react";
import { format, subDays, parseISO } from "date-fns";

interface NotificationModalProps {
  order: OrderDTO;
  milestone: MilestoneDTO;
  open: boolean;
  onClose: () => void;
  onSuccess?: (updatedOrder: OrderDTO) => void;
}

export function NotificationModal({
  order,
  milestone,
  open,
  onClose,
  onSuccess,
}: NotificationModalProps) {
  // Tính ngày gửi mặc định: Trước hạn kết thúc 2 ngày (hoặc ngày bắt đầu nếu thời gian ngắn)
  const defaultNotifyDate = (() => {
    if (milestone.notifyConfig?.notifyDate) {
      return milestone.notifyConfig.notifyDate;
    }
    try {
      const end = parseISO(milestone.endDate);
      const target = subDays(end, milestone.notifyConfig?.remindDaysBefore || 2);
      return format(target, "yyyy-MM-dd");
    } catch {
      return milestone.startDate;
    }
  })();

  const defaultMessage = (() => {
    if (milestone.notifyConfig?.customMessage) {
      return milestone.notifyConfig.customMessage;
    }
    return `Kính gửi Quý Khách hàng, mốc "${milestone.title}" của đơn hàng ${order.orderCode} (${order.productName}) dự kiến sẽ hoàn thành vào ngày ${formatDateVN(milestone.endDate)}. Thái Hương xin thông báo để Quý khách theo dõi tiến độ.`;
  })();

  const [notifyDate, setNotifyDate] = useState<string>(defaultNotifyDate);
  const [sendEmail, setSendEmail] = useState<boolean>(
    milestone.notifyConfig?.sendEmail ?? true
  );
  const [sendNotification, setSendNotification] = useState<boolean>(
    milestone.notifyConfig?.sendNotification ?? true
  );
  const [customMessage, setCustomMessage] = useState<string>(defaultMessage);
  const [isSaving, setIsSaving] = useState(false);

  // Tính số ngày báo trước so với ngày kết thúc
  const getDaysBefore = (selectedDateStr: string) => {
    try {
      const end = parseISO(milestone.endDate);
      const selected = parseISO(selectedDateStr);
      const diffTime = end.getTime() - selected.getTime();
      return Math.round(diffTime / (1000 * 3600 * 24));
    } catch {
      return 2;
    }
  };

  const handleQuickSelectDate = (type: "2_days_before" | "start_date" | "end_date") => {
    try {
      if (type === "2_days_before") {
        const d = subDays(parseISO(milestone.endDate), 2);
        setNotifyDate(format(d, "yyyy-MM-dd"));
      } else if (type === "start_date") {
        setNotifyDate(milestone.startDate);
      } else if (type === "end_date") {
        setNotifyDate(milestone.endDate);
      }
    } catch {}
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const remindDaysBefore = getDaysBefore(notifyDate);

      const updatedNotifyConfig: MilestoneNotifyConfig = {
        sendEmail,
        sendNotification,
        notifyDate,
        remindDaysBefore: remindDaysBefore >= 0 ? remindDaysBefore : 0,
        customMessage,
        lastNotifiedAt: milestone.notifyConfig?.lastNotifiedAt,
        isNotified: milestone.notifyConfig?.isNotified ?? false,
      };

      const updatedOrder = await milestoneService.updateMilestone(
        order.id,
        milestone.id,
        {
          notifyConfig: updatedNotifyConfig,
        }
      );

      onSuccess?.(updatedOrder);
      onClose();
    } catch (err: any) {
      alert(err.message || "Lỗi khi lưu cấu hình thông báo");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            Cấu Hình Lịch Thông Báo (Mốc #{milestone.stepNumber}: {milestone.title})
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Xem và thiết lập thời gian gửi cùng nội dung thông báo tự động cho khách hàng.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 1. Trạng thái lịch gửi hiện tại */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-blue-900 font-medium">
                {milestone.notifyConfig?.isNotified ? (
                  <>
                    Trạng thái:{" "}
                    <strong className="text-emerald-700">Đã gửi thông báo</strong> (lúc{" "}
                    {formatDateTimeVN(milestone.notifyConfig.lastNotifiedAt)})
                  </>
                ) : (
                  <>
                    Lịch gửi dự kiến:{" "}
                    <strong className="text-blue-700">
                      {notifyDate ? formatDateVN(notifyDate) : "Chưa đặt ngày"}
                    </strong>
                  </>
                )}
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-blue-200 text-blue-700 font-semibold">
              Mốc: {formatDateVN(milestone.startDate)} - {formatDateVN(milestone.endDate)}
            </span>
          </div>

          {/* 2. Danh sách người nhận */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Người nhận thông báo:
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>
                <strong>Khách hàng:</strong> {order.customer.name} ({order.customer.email})
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                <strong>Đại diện Thái Hương:</strong> {order.thaiHuongPIC.name} (
                {order.thaiHuongPIC.email})
              </span>
            </div>
          </div>

          {/* 3. Cấu hình ngày gửi thông báo */}
          <div className="space-y-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
            <label className="font-bold text-slate-800 block">
              1. Ngày gửi thông báo cho khách hàng (dd/mm/yyyy):
            </label>
            <div className="max-w-xs">
              <DateInputVN
                value={notifyDate}
                onChange={setNotifyDate}
                placeholder="dd/mm/yyyy"
                required
              />
            </div>
            {/* Phím chọn nhanh ngày */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickSelectDate("2_days_before")}
                className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Trước hạn 2 ngày
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelectDate("start_date")}
                className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Ngày bắt đầu mốc
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelectDate("end_date")}
                className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Ngày hạn chót mốc
              </button>
            </div>
          </div>

          {/* 4. Kênh thông báo */}
          <div className="space-y-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
            <label className="font-bold text-slate-800 block">
              2. Kênh gửi thông báo:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-slate-700">
                  Gửi Email tự động tới Khách hàng và Người đại diện Thái Hương
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-slate-700">
                  Bật Thông báo đẩy (Web Push / FCM) trên màn hình thiết bị
                </span>
              </label>
            </div>
          </div>

          {/* 5. Nội dung thông báo dự kiến gửi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                3. Nội dung thông báo & email dự kiến gửi:
              </label>
              <button
                type="button"
                onClick={() =>
                  setCustomMessage(
                    `Kính gửi Quý Khách hàng, mốc "${milestone.title}" của đơn hàng ${order.orderCode} (${order.productName}) dự kiến sẽ hoàn thành vào ngày ${formatDateVN(milestone.endDate)}. Thái Hương xin thông báo để Quý khách theo dõi tiến độ.`
                  )
                }
                className="text-[11px] text-blue-600 hover:underline"
              >
                Khôi phục mẫu chuẩn
              </button>
            </div>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Nhập nội dung sẽ được gửi đến khách hàng..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSaving} size="sm">
            Hủy
          </Button>
          <Button
            onClick={handleSaveConfig}
            disabled={isSaving}
            size="sm"
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSaving ? "Đang lưu cấu hình..." : "Lưu Cấu Hình Thông Báo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
