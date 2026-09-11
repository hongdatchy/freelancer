"use client";

import { useEffect, useState, use } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { orderService } from "@/service/order-service";
import { InteractiveTimeline } from "@/components/custom/timeline/interactive-timeline";
import { OrderStatusBadge } from "@/components/custom/common/status-badge";
import { formatDateVN } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  Bell,
  Package,
} from "lucide-react";
import { notificationService } from "@/service/notification-service";

export default function CustomerTrackPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      try {
        const data = await orderService.getOrderByTrackingCode(resolvedParams.code);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [resolvedParams.code]);

  const handleEnableNotification = async () => {
    const granted = await notificationService.requestNotificationPermission(resolvedParams.code);
    if (granted) {
      notificationService.showBrowserNotification({
        title: "🔔 [Dược Mỹ Phẩm Thái Hương]",
        body: `Đã kích hoạt thông báo thành công cho đơn ${order?.orderCode || resolvedParams.code}!`,
      });
    } else {
      alert("Trình duyệt không cho phép quyền thông báo. Bạn hãy bấm vào biểu tượng cài đặt/ổ khóa bên cạnh thanh địa chỉ URL để cấp quyền Thông báo nhé!");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500">
        Đang tải tiến độ đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Không tìm thấy đơn hàng với mã: {resolvedParams.code}
        </h2>
        <p className="text-sm text-slate-500">
          Vui lòng kiểm tra lại đường dẫn tra cứu hoặc liên hệ với nhân viên phụ trách Thái Hương để được hỗ trợ.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner Khách Hàng */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              Cổng Tra Cứu Tiến Độ Sản Xuất Trực Tuyến
            </span>
            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-slate-300">
              Dược Mỹ Phẩm Thái Hương
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {order.productName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
            <span>
              Mã đơn hàng: <strong className="text-white">{order.orderCode}</strong>
            </span>
            <span>•</span>
            <span>
              Quý khách: <strong className="text-white">{order.customer.name}</strong>
            </span>
            <span>•</span>
            <span>
              Dự kiến giao:{" "}
              <strong className="text-amber-300">
                {formatDateVN(order.expectedDeliveryDate)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin nhân viên phụ trách hỗ trợ khách */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
            TH
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Chuyên viên phụ trách đơn hàng của bạn</div>
            <div className="font-bold text-slate-800 text-sm">{order.thaiHuongPIC.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{order.thaiHuongPIC.email}</span>
              {order.thaiHuongPIC.phone && (
                <>
                  <span>•</span>
                  <span>{order.thaiHuongPIC.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleEnableNotification}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-blue-700 border-blue-200 bg-blue-50/60 hover:bg-blue-100 self-start sm:self-auto"
        >
          <Bell className="w-3.5 h-3.5 text-amber-500" />
          Bật Nhắc Nhở Trên Trình Duyệt
        </Button>
      </div>

      {/* Ghi chú đơn hàng nếu có */}
      {order.notes && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
          <Package className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-0.5 flex-1">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Ghi chú & Yêu cầu sản xuất:
            </span>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm">
              {order.notes}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Timeline (Read-only for Customer) */}
      <InteractiveTimeline order={order} isReadOnly={true} />
    </div>
  );
}
