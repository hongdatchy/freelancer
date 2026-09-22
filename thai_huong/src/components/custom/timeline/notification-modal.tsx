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
import {
  formatDateVN,
  formatDateTimeVN,
  subDaysExcludingSunday,
  differenceInDaysExcludingSunday,
} from "@/lib/utils";
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
      const target = subDaysExcludingSunday(end, milestone.notifyConfig?.remindDaysBefore || 2);
      return format(target, "yyyy-MM-dd");
    } catch {
      return milestone.startDate;
    }
  })();

  const defaultThaiHuongDate = (() => {
    if (milestone.notifyConfig?.thaiHuongNotifyDate) {
      return milestone.notifyConfig.thaiHuongNotifyDate;
    }
    try {
      if (defaultNotifyDate) {
        return format(subDaysExcludingSunday(parseISO(defaultNotifyDate), 1), "yyyy-MM-dd");
      }
    } catch {}
    return defaultNotifyDate;
  })();

  const defaultMessage = (() => {
    if (milestone.notifyConfig?.customMessage) {
      return milestone.notifyConfig.customMessage;
    }
    return `Kính gửi Quý Khách hàng, mốc "${milestone.title}" của đơn hàng ${order.orderCode} (${order.productName}) dự kiến sẽ hoàn thành vào ngày ${formatDateVN(milestone.endDate)}. Thái Hương xin thông báo để Quý khách theo dõi tiến độ.`;
  })();

  const [notifyDate, setNotifyDate] = useState<string>(defaultNotifyDate);
  const [thaiHuongNotifyDate, setThaiHuongNotifyDate] = useState<string>(defaultThaiHuongDate);
  const [sendEmail, setSendEmail] = useState<boolean>(
    milestone.notifyConfig?.sendEmail ?? true
  );
  const [sendNotification, setSendNotification] = useState<boolean>(
    milestone.notifyConfig?.sendNotification ?? true
  );
  const [customMessage, setCustomMessage] = useState<string>(defaultMessage);
  const [isSaving, setIsSaving] = useState(false);

  // Tính số ngày làm việc báo trước so với ngày kết thúc (bỏ qua Chủ Nhật)
  const getDaysBefore = (selectedDateStr: string) => {
    try {
      return differenceInDaysExcludingSunday(milestone.endDate, selectedDateStr);
    } catch {
      return 2;
    }
  };

  const handleNotifyDateChange = (newDate: string) => {
    setNotifyDate(newDate);
    try {
      if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        setThaiHuongNotifyDate(format(subDaysExcludingSunday(parseISO(newDate), 1), "yyyy-MM-dd"));
      }
    } catch {}
  };

  const handleQuickSelectDate = (type: "2_days_before" | "start_date" | "end_date") => {
    try {
      let targetDate = "";
      if (type === "2_days_before") {
        const d = subDaysExcludingSunday(parseISO(milestone.endDate), 2);
        targetDate = format(d, "yyyy-MM-dd");
      } else if (type === "start_date") {
        targetDate = milestone.startDate;
      } else if (type === "end_date") {
        targetDate = milestone.endDate;
      }
      if (targetDate) {
        setNotifyDate(targetDate);
        setThaiHuongNotifyDate(format(subDaysExcludingSunday(parseISO(targetDate), 1), "yyyy-MM-dd"));
      }
    } catch {}
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const remindDaysBefore = getDaysBefore(notifyDate);
      const computedThaiHuongDate =
        thaiHuongNotifyDate || (notifyDate ? format(subDaysExcludingSunday(parseISO(notifyDate), 1), "yyyy-MM-dd") : undefined);

      const todayStr = format(new Date(), "yyyy-MM-dd");

      // Nếu quản trị viên đổi sang ngày mới trong tương lai, reset cờ để gửi lại theo lịch mới
      const isDateChanged = notifyDate !== milestone.notifyConfig?.notifyDate;
      const isCustomerNotified =
        isDateChanged && notifyDate > todayStr
          ? false
          : (milestone.notifyConfig?.isCustomerNotified ?? milestone.notifyConfig?.isNotified ?? false);

      const isThaiHuongNotified =
        isDateChanged && computedThaiHuongDate && computedThaiHuongDate > todayStr
          ? false
          : (milestone.notifyConfig?.isThaiHuongNotified ?? milestone.notifyConfig?.isNotified ?? false);

      const isNotified = isThaiHuongNotified && isCustomerNotified;

      const updatedNotifyConfig: MilestoneNotifyConfig = {
        sendEmail,
        sendNotification,
        notifyDate,
        thaiHuongNotifyDate: computedThaiHuongDate,
        remindDaysBefore: remindDaysBefore >= 0 ? remindDaysBefore : 0,
        customMessage,
        lastNotifiedAt: isNotified ? (milestone.notifyConfig?.lastNotifiedAt || new Date().toISOString()) : undefined,
        isNotified,
        isThaiHuongNotified,
        thaiHuongNotifiedAt: isThaiHuongNotified ? milestone.notifyConfig?.thaiHuongNotifiedAt : undefined,
        isCustomerNotified,
        customerNotifiedAt: isCustomerNotified ? milestone.notifyConfig?.customerNotifiedAt : undefined,
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
          {/* 1. Tổng quan lịch gửi của 2 bên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Đại diện Thái Hương */}
            <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  Đại diện Thái Hương
                </span>
                {milestone.notifyConfig?.isThaiHuongNotified || milestone.notifyConfig?.isNotified ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Đã gửi
                  </span>
                ) : (
                  <span className="text-[10px] bg-indigo-200/70 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                    Chờ gửi
                  </span>
                )}
              </div>
              <div className="text-xs text-indigo-900">
                Lịch nhắc:{" "}
                <strong className="text-indigo-700 font-bold">
                  {thaiHuongNotifyDate ? formatDateVN(thaiHuongNotifyDate) : "Chưa đặt ngày"}
                </strong>
              </div>
              <p className="text-[10px] text-indigo-600">
                ⚡ Nhắc trước khách hàng 1 ngày để kịp thời chuẩn bị vật tư & sản xuất.
              </p>
              {(milestone.notifyConfig?.thaiHuongNotifiedAt || milestone.notifyConfig?.lastNotifiedAt) && (
                <div className="text-[10px] text-slate-500 pt-0.5">
                  Đã gửi lúc: {formatDateTimeVN(milestone.notifyConfig.thaiHuongNotifiedAt || milestone.notifyConfig.lastNotifiedAt)}
                </div>
              )}
            </div>

            {/* Khách Hàng */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Khách hàng
                </span>
                {milestone.notifyConfig?.isCustomerNotified || milestone.notifyConfig?.isNotified ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Đã gửi
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-200/70 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    Chờ gửi
                  </span>
                )}
              </div>
              <div className="text-xs text-blue-900">
                Lịch báo:{" "}
                <strong className="text-blue-700 font-bold">
                  {notifyDate ? formatDateVN(notifyDate) : "Chưa đặt ngày"}
                </strong>
              </div>
              <p className="text-[10px] text-blue-600">
                📢 Cập nhật tiến độ chính thức cho khách hàng theo dõi.
              </p>
              {(milestone.notifyConfig?.customerNotifiedAt || milestone.notifyConfig?.lastNotifiedAt) && (
                <div className="text-[10px] text-slate-500 pt-0.5">
                  Đã gửi lúc: {formatDateTimeVN(milestone.notifyConfig.customerNotifiedAt || milestone.notifyConfig.lastNotifiedAt)}
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] px-3 py-1.5 bg-slate-100 rounded-lg flex items-center justify-between text-slate-600">
            <span>Thời gian triển khai mốc:</span>
            <span className="font-semibold text-slate-800">
              {formatDateVN(milestone.startDate)} - {formatDateVN(milestone.endDate)}
            </span>
          </div>

          {/* 2. Danh sách người nhận */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Người nhận thông báo:
            </div>
            <div className="flex items-center justify-between text-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Đại diện Thái Hương:</strong> {order.thaiHuongPIC.name} ({order.thaiHuongPIC.email})
                </span>
              </div>
              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded shrink-0">
                Sớm hơn 1 ngày
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  <strong>Khách hàng:</strong> {order.customer.name} ({order.customer.email})
                </span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">
                Ngày chuẩn
              </span>
            </div>
          </div>

          {/* 3. Cấu hình ngày gửi thông báo */}
          <div className="space-y-2.5 p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
            <div>
              <label className="font-bold text-slate-800 block text-xs">
                1. Ngày gửi thông báo cho Khách hàng (dd/mm/yyyy):
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ngày Đại diện Thái Hương nhận thông báo sẽ tự động tính sớm hơn 1 ngày ({thaiHuongNotifyDate ? formatDateVN(thaiHuongNotifyDate) : "---"}).
              </p>
            </div>

            <div className="max-w-xs">
              <DateInputVN
                value={notifyDate}
                onChange={handleNotifyDateChange}
                placeholder="dd/mm/yyyy"
                required
              />
            </div>

            {/* Phím chọn nhanh ngày */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickSelectDate("2_days_before")}
                className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Trước hạn 2 ngày
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelectDate("start_date")}
                className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                Ngày bắt đầu mốc
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelectDate("end_date")}
                className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors"
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
