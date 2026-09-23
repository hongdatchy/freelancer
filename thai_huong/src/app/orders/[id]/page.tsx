"use client";

import { useEffect, useState, use } from "react";
import { OrderDTO, getCustomerEmails } from "@/dto/OrderDTO";
import { orderService } from "@/service/order-service";
import { InteractiveTimeline } from "@/components/custom/timeline/interactive-timeline";
import { OrderStatusBadge } from "@/components/custom/common/status-badge";
import { formatDateVN } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderEditModal } from "@/components/custom/orders/order-edit-modal";
import {
  ArrowLeft,
  Copy,
  Check,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  ExternalLink,
  Edit,
  FileText,
} from "lucide-react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrderById(resolvedParams.id);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [resolvedParams.id]);

  const handleCopyCustomerLink = () => {
    if (!order) return;
    const url = `${window.location.origin}/track/${order.orderCode}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Đang tải thông tin chi tiết đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy đơn hàng</h2>
        <Button asChild variant="outline">
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit gap-1 text-slate-600">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Danh sách đơn hàng
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-slate-700 border-slate-300 hover:bg-slate-100"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="w-3.5 h-3.5 text-blue-600" />
            Chỉnh Sửa Thông Tin
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100"
            onClick={handleCopyCustomerLink}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Đã sao chép link!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Sao Chép Link Gửi Khách Xem
              </>
            )}
          </Button>

          <Button asChild size="sm" variant="default" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700">
            <Link href={`/track/${order.orderCode}`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5" />
              Mở Tab Khách Xem
            </Link>
          </Button>
        </div>
      </div>

      {/* Thông tin 2 bên đối tác */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Khách hàng */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Thông tin Khách Hàng
          </span>
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-600" />
            {order.customer.name}
          </h4>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="flex items-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1">
                {getCustomerEmails(order.customer).map((em, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 font-mono text-[11px] px-1.5 py-0.5 rounded"
                  >
                    {em}
                  </span>
                ))}
              </div>
            </div>
            {order.customer.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.customer.phone}
              </p>
            )}
            {order.customer.company && (
              <p className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {order.customer.company}
              </p>
            )}
          </div>
        </div>

        {/* Phụ trách Thái Hương */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Đại diện Thái Hương Phụ Trách
          </span>
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-600" />
            {order.thaiHuongPIC.name}
          </h4>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {order.thaiHuongPIC.email}
            </p>
            {order.thaiHuongPIC.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.thaiHuongPIC.phone}
              </p>
            )}
          </div>
        </div>

        {/* Thông tin sản xuất */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Thời Gian & Kế Hoạch
          </span>
          <div className="space-y-1 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Bắt đầu:</span>
              <span className="font-semibold">{formatDateVN(order.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giao dự kiến:</span>
              <span className="font-semibold text-blue-600">
                {formatDateVN(order.expectedDeliveryDate)}
              </span>
            </div>
            {order.quantity && (
              <div className="flex justify-between">
                <span className="text-slate-500">Số lượng:</span>
                <span className="font-semibold">
                  {order.quantity.toLocaleString()} {order.unit || "sản phẩm"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ghi chú đơn hàng nếu có */}
      {order.notes && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
          <FileText className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1 flex-1">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Ghi chú đơn hàng:
            </span>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm">
              {order.notes}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Timeline 7 Mốc */}
      <InteractiveTimeline
        order={order}
        onOrderUpdated={(updated) => setOrder(updated)}
      />

      {/* Modal chỉnh sửa thông tin đơn hàng */}
      {isEditModalOpen && (
        <OrderEditModal
          order={order}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updated) => setOrder(updated)}
        />
      )}
    </div>
  );
}
