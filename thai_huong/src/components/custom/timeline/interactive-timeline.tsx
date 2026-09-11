"use client";

import { useState } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { MilestoneCard } from "./milestone-card";
import { MilestoneEditModal } from "./milestone-edit-modal";
import { NotificationModal } from "./notification-modal";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, PlayCircle, Send, Bell } from "lucide-react";
import { notificationService } from "@/service/notification-service";

interface InteractiveTimelineProps {
  order: OrderDTO;
  isReadOnly?: boolean;
  onOrderUpdated?: (order: OrderDTO) => void;
}

export function InteractiveTimeline({
  order,
  isReadOnly = false,
  onOrderUpdated,
}: InteractiveTimelineProps) {
  const [selectedMilestoneForEdit, setSelectedMilestoneForEdit] =
    useState<MilestoneDTO | null>(null);
  const [selectedMilestoneForNoti, setSelectedMilestoneForNoti] =
    useState<MilestoneDTO | null>(null);

  // Tính phần trăm hoàn thành (số mốc đã hoàn thành / 7)
  const completedCount = order.milestones.filter((m) => m.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  const handleRequestPushPermission = async () => {
    const granted = await notificationService.requestNotificationPermission();
    if (granted) {
      alert("Đã bật thông báo thành công trên trình duyệt!");
    } else {
      alert("Trình duyệt không cho phép hoặc quyền thông báo bị từ chối.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tiến độ & % Hoàn thành */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">
                Quy trình 7 Mốc Sản Xuất
              </span>
              <span className="text-sm font-semibold text-slate-500">
                (Đang ở Mốc #{order.currentStep}: {order.milestones[order.currentStep - 1]?.title})
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {order.productName}
            </h3>
            <p className="text-sm text-slate-500">
              Mã đơn: <span className="font-semibold text-slate-700">{order.orderCode}</span> | Khách hàng:{" "}
              <span className="font-semibold text-slate-700">{order.customer.name}</span>
            </p>
          </div>

          {/* Nút bật thông báo trình duyệt */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-slate-700 border-slate-300"
              onClick={handleRequestPushPermission}
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              Bật Chuông Thông Báo
            </Button>
          </div>
        </div>

        {/* Thanh tiến độ */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Tiến độ tổng thể</span>
            <span className="text-blue-600 font-bold">{progressPercent}% ({completedCount}/7 mốc)</span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-slate-100" />
        </div>

        {/* Stepper ngang (Visual 7 Steps) */}
        <div className="hidden lg:grid grid-cols-7 gap-2 mt-6 pt-6 border-t border-slate-100">
          {order.milestones.map((m) => {
            const isDone = m.status === "COMPLETED";
            const isCurrent = m.status === "IN_PROGRESS";
            const isDelayed = m.status === "DELAYED";

            return (
              <div
                key={m.id}
                onClick={() => !isReadOnly && setSelectedMilestoneForEdit(m)}
                className={`relative flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-blue-50/80 border border-blue-300 ring-2 ring-blue-500/20"
                    : isDone
                    ? "bg-emerald-50/40 hover:bg-emerald-50"
                    : "hover:bg-slate-50"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-1.5 transition-transform ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isCurrent
                      ? "bg-blue-600 text-white shadow-md scale-110"
                      : isDelayed
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <PlayCircle className="w-5 h-5" />
                  ) : (
                    m.stepNumber
                  )}
                </div>

                <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                  {m.title}
                </span>

                {m.stepNumber === 1 && (
                  <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                    (25-28 ngày)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid danh sách chi tiết 7 mốc */}
      <div className="space-y-3">
        <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
          Chi tiết từng mốc công việc
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              order={order}
              isReadOnly={isReadOnly}
              onEdit={!isReadOnly ? (m) => setSelectedMilestoneForEdit(m) : undefined}
              onSendNotification={
                !isReadOnly ? (m) => setSelectedMilestoneForNoti(m) : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Modal cập nhật mốc */}
      {selectedMilestoneForEdit && (
        <MilestoneEditModal
          order={order}
          milestone={selectedMilestoneForEdit}
          open={!!selectedMilestoneForEdit}
          onClose={() => setSelectedMilestoneForEdit(null)}
          onSuccess={(updatedOrder) => {
            setSelectedMilestoneForEdit(null);
            onOrderUpdated?.(updatedOrder);
          }}
        />
      )}

      {/* Modal gửi thông báo (Noti & Sendmail) */}
      {selectedMilestoneForNoti && (
        <NotificationModal
          order={order}
          milestone={selectedMilestoneForNoti}
          open={!!selectedMilestoneForNoti}
          onClose={() => setSelectedMilestoneForNoti(null)}
        />
      )}
    </div>
  );
}
