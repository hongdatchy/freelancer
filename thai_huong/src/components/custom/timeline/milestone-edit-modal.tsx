"use client";

import { useState } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO, MilestoneStatus } from "@/dto/MilestoneDTO";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { milestoneService } from "@/service/milestone-service";
import { notificationService } from "@/service/notification-service";
import { ShieldAlert, Send } from "lucide-react";

interface MilestoneEditModalProps {
  order: OrderDTO;
  milestone: MilestoneDTO;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: OrderDTO) => void;
}

export function MilestoneEditModal({
  order,
  milestone,
  open,
  onClose,
  onSuccess,
}: MilestoneEditModalProps) {
  const [status, setStatus] = useState<MilestoneStatus>(milestone.status);
  const [startDate, setStartDate] = useState(milestone.startDate);
  const [endDate, setEndDate] = useState(milestone.endDate);
  const [notes, setNotes] = useState(milestone.notes || "");
  const [sendNotifyOnSave, setSendNotifyOnSave] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFixed = milestone.stepNumber === 1;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const updated = await milestoneService.updateMilestone(order.id, milestone.id, {
        status,
        startDate,
        endDate,
        notes,
      });

      if (sendNotifyOnSave) {
        await notificationService.sendMilestoneEmail({
          order: updated,
          milestone: { ...milestone, status, startDate, endDate, notes },
          type: status === "COMPLETED" ? "COMPLETED" : "MANUAL_ALERT",
          customMessage: `Đã cập nhật trạng thái mốc sang: ${status}. ${notes ? `Ghi chú: ${notes}` : ""}`,
        });
      }

      onSuccess(updated);
    } catch (err: any) {
      alert(err.message || "Lỗi khi cập nhật mốc");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">
            Cập nhật Mốc #{milestone.stepNumber}: {milestone.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isFixed && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <span>
                <strong>Lưu ý nghiệp vụ:</strong> Mốc Hồ sơ công bố có thời hạn quy chuẩn từ <strong>25 - 28 ngày</strong> để cơ quan quản lý thẩm định.
              </span>
            </div>
          )}

          {/* Trạng thái */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Trạng thái mốc:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
              className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">Chờ thực hiện (PENDING)</option>
              <option value="IN_PROGRESS">Đang tiến hành (IN_PROGRESS)</option>
              <option value="COMPLETED">Đã hoàn thành (COMPLETED)</option>
              <option value="DELAYED">Chậm tiến độ (DELAYED)</option>
            </select>
          </div>

          {/* Ngày bắt đầu và kết thúc */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Ngày bắt đầu:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Ngày dự kiến xong:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Ghi chú tiến độ thực tế:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú cho cả bên Thái Hương và Khách cùng theo dõi..."
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tuỳ chọn gửi mail ngay */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <input
              type="checkbox"
              id="notifyCheck"
              checked={sendNotifyOnSave}
              onChange={(e) => setSendNotifyOnSave(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="notifyCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
              Gửi email & thông báo cập nhật này cho cả Khách hàng & Thái Hương PIC
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
