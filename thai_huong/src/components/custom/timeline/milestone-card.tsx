import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { OrderDTO } from "@/dto/OrderDTO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MilestoneStatusBadge } from "../common/status-badge";
import { formatDateVN, getDaysRemaining, subDaysExcludingSunday } from "@/lib/utils";
import { Calendar, Clock, Bell, Edit, ShieldCheck, CalendarClock, Building, User } from "lucide-react";
import { parseISO } from "date-fns";

interface MilestoneCardProps {
  milestone: MilestoneDTO;
  order: OrderDTO;
  isReadOnly?: boolean;
  onEdit?: (milestone: MilestoneDTO) => void;
  onSendNotification?: (milestone: MilestoneDTO) => void;
}

export function MilestoneCard({
  milestone,
  order,
  isReadOnly = false,
  onEdit,
  onSendNotification,
}: MilestoneCardProps) {
  const remaining = getDaysRemaining(milestone.endDate);
  const isCompleted = milestone.status === "COMPLETED";
  const isInProgress = milestone.status === "IN_PROGRESS";
  const isDelayed = milestone.status === "DELAYED";
  const isFixed = milestone.stepNumber === 1; // Mốc 1: Hồ sơ công bố 25-28 ngày

  return (
    <Card
      className={`transition-all border ${
        isInProgress
          ? "border-blue-500 shadow-md ring-1 ring-blue-400/40 bg-blue-50/20"
          : isCompleted
          ? "border-emerald-200 bg-emerald-50/10"
          : isDelayed
          ? "border-red-300 bg-red-50/20"
          : "border-slate-200"
      }`}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : isInProgress
                ? "bg-blue-600 text-white"
                : isDelayed
                ? "bg-red-600 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {milestone.stepNumber}
          </span>
          <div>
            <h4 className="font-bold text-base text-slate-800 flex items-center gap-1.5">
              {milestone.title}
              {isFixed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Quy chuẩn 28 ngày
                </span>
              )}
            </h4>
          </div>
        </div>
        <MilestoneStatusBadge status={milestone.status} />
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* Timeline dates */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div>
            <span className="text-slate-500 block">Bắt đầu:</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDateVN(milestone.startDate)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Dự kiến xong:</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDateVN(milestone.endDate)}
            </span>
          </div>
        </div>

        {/* Countdown tag */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {isCompleted ? (
              <span className="text-emerald-600 font-medium">Hoàn thành</span>
            ) : (
              <span
                className={`font-semibold ${
                  remaining.isOverdue
                    ? "text-red-600"
                    : remaining.isToday
                    ? "text-amber-600 font-bold"
                    : "text-blue-600"
                }`}
              >
                {remaining.label}
              </span>
            )}
          </span>
          {milestone.durationDays && (
            <span className="text-slate-400">({milestone.durationDays} ngày)</span>
          )}
        </div>

        {/* Notes */}
        {milestone.notes && (
          <p className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/50 p-2 rounded">
            💡 {milestone.notes}
          </p>
        )}

        {/* Lịch gửi thông báo nếu đã cấu hình */}
        {milestone.notifyConfig?.notifyDate && (
          <div className="text-[11px] bg-slate-50 border border-slate-200/80 p-2 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-700">
                <Building className="w-3 h-3 text-indigo-600 shrink-0" />
                <span className="font-medium text-indigo-900">Thái Hương:</span>{" "}
                <strong>
                  {milestone.notifyConfig.thaiHuongNotifyDate
                    ? formatDateVN(milestone.notifyConfig.thaiHuongNotifyDate)
                    : formatDateVN(subDaysExcludingSunday(parseISO(milestone.notifyConfig.notifyDate), 1))}
                </strong>
              </span>
              {milestone.notifyConfig.isThaiHuongNotified || milestone.notifyConfig.isNotified ? (
                <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">
                  Đã gửi
                </span>
              ) : (
                <span className="text-amber-700 font-medium text-[10px] bg-amber-100/80 px-1.5 py-0.2 rounded">
                  Chờ gửi
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-700">
                <User className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="font-medium text-blue-900">Khách hàng:</span>{" "}
                <strong>{formatDateVN(milestone.notifyConfig.notifyDate)}</strong>
              </span>
              {milestone.notifyConfig.isCustomerNotified || milestone.notifyConfig.isNotified ? (
                <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">
                  Đã gửi
                </span>
              ) : (
                <span className="text-amber-700 font-medium text-[10px] bg-amber-100/80 px-1.5 py-0.2 rounded">
                  Chờ gửi
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions for Admin */}
        {!isReadOnly && (
          <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex-1 gap-1"
                onClick={() => onEdit(milestone)}
              >
                <Edit className="w-3 h-3" />
                Cập nhật
              </Button>
            )}
            {onSendNotification && (
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs gap-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                onClick={() => onSendNotification(milestone)}
                title="Xem và cấu hình ngày gửi, nội dung thông báo cho khách"
              >
                <CalendarClock className="w-3.5 h-3.5 text-blue-600" />
                Lịch thông báo
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
