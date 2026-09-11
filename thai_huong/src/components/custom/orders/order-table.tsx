"use client";

import { useState } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { OrderStatusBadge } from "../common/status-badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDateVN } from "@/lib/utils";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { orderService } from "@/service/order-service";

interface OrderTableProps {
  orders: OrderDTO[];
  onOrderDeleted?: () => void;
}

export function OrderTable({ orders, onOrderDeleted }: OrderTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTrackingLink = (order: OrderDTO) => {
    const url = `${window.location.origin}/track/${order.orderCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${code}?`)) {
      await orderService.deleteOrder(id);
      onOrderDeleted?.();
    }
  };

  if (!orders.length) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="font-bold text-slate-700 text-lg">Chưa có đơn hàng sản xuất nào</h4>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Bấm nút "Tạo Đơn Hàng Mới" để bắt đầu theo dõi tiến độ 7 mốc sản xuất cho khách hàng của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {orders.map((order) => {
        const completedMilestones = order.milestones.filter(
          (m) => m.status === "COMPLETED"
        ).length;
        const percent = Math.round((completedMilestones / 7) * 100);
        const currentMilestone = order.milestones[order.currentStep - 1];

        return (
          <div
            key={order.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Thông tin đơn */}
            <div className="space-y-2 flex-1 min-w-[280px]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded text-sm border border-blue-200">
                  {order.orderCode}
                </span>
                <OrderStatusBadge status={order.status} />
                <span className="text-xs text-slate-400">
                  Tạo ngày: {formatDateVN(order.startDate)}
                </span>
              </div>

              <div>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {order.productName}
                </Link>
                {order.quantity && (
                  <span className="text-xs text-slate-500 ml-2">
                    ({order.quantity.toLocaleString()} {order.unit || "sản phẩm"})
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Khách:</strong> {order.customer.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Giao dự kiến:</strong> {formatDateVN(order.expectedDeliveryDate)}
                </span>
              </div>

              {order.notes && (
                <p className="text-slate-600 bg-amber-50/70 border border-amber-200/60 px-2.5 py-1 rounded text-xs line-clamp-1">
                  💡 <strong>Ghi chú:</strong> {order.notes}
                </p>
              )}
            </div>

            {/* Tiến độ mốc */}
            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Mốc #{order.currentStep}:{" "}
                  <strong className="text-slate-800">{currentMilestone?.title || "Hoàn tất"}</strong>
                </span>
                <span className="font-bold text-blue-600">{percent}%</span>
              </div>
              <Progress value={percent} className="h-2.5 bg-slate-100" />
              <div className="text-[11px] text-slate-400 text-right">
                Đã hoàn thành {completedMilestones}/7 mốc
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
              <Button
                asChild
                variant="default"
                size="sm"
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
              >
                <Link href={`/orders/${order.id}`}>
                  <ExternalLink className="w-3.5 h-3.5" />
                  Timeline Chi Tiết
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9 border-slate-300 text-slate-700"
                onClick={() => handleCopyTrackingLink(order)}
                title="Sao chép đường dẫn gửi cho khách hàng tra cứu"
              >
                {copiedId === order.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Đã chép link!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Link Khách
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-600 h-9 px-2"
                onClick={() => handleDelete(order.id, order.orderCode)}
                title="Xóa đơn"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
