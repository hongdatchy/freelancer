import { Badge } from "@/components/ui/badge";
import { MilestoneStatus } from "@/dto/MilestoneDTO";
import { OrderStatus } from "@/dto/OrderDTO";
import { CheckCircle2, Clock, AlertTriangle, PlayCircle } from "lucide-react";

export function MilestoneStatusBadge({ status }: { status: MilestoneStatus }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Hoàn thành
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="info" className="gap-1 animate-pulse">
          <PlayCircle className="w-3 h-3 text-blue-600" />
          Đang tiến hành
        </Badge>
      );
    case "DELAYED":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Chậm tiến độ
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge variant="secondary" className="gap-1 text-slate-600">
          <Clock className="w-3 h-3" />
          Chờ thực hiện
        </Badge>
      );
  }
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Đã giao hàng
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="info" className="gap-1">
          <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
          Đang sản xuất
        </Badge>
      );
    case "DELAYED":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          Chậm tiến độ
        </Badge>
      );
    case "DRAFT":
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3.5 h-3.5" />
          Bản nháp
        </Badge>
      );
  }
}
