import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { OrderDTO } from "@/dto/OrderDTO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MilestoneStatusBadge } from "../common/status-badge";
import { formatDateVN, getDaysRemaining } from "@/lib/utils";
import { Calendar, Clock, Bell, Edit, ShieldCheck } from "lucide-react";

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
                  Cố định 25-28 ngày
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
                className="h-8 text-xs gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100"
                onClick={() => onSendNotification(milestone)}
              >
                <Bell className="w-3 h-3 text-blue-600" />
                Báo Noti & Mail
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
