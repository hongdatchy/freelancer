"use client";

import { useState } from "react";
import { OrderDTO } from "@/dto/OrderDTO";
import { orderService } from "@/service/order-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3 } from "lucide-react";

interface OrderEditModalProps {
  order: OrderDTO;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: OrderDTO) => void;
}

export function OrderEditModal({
  order,
  open,
  onClose,
  onSuccess,
}: OrderEditModalProps) {
  const [productName, setProductName] = useState(order.productName || "");
  const [quantity, setQuantity] = useState<string>(
    order.quantity ? String(order.quantity) : ""
  );
  const [unit, setUnit] = useState(order.unit || "");
  const [startDate, setStartDate] = useState(order.startDate || "");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    order.expectedDeliveryDate || ""
  );

  // Khách hàng
  const [customerName, setCustomerName] = useState(order.customer.name || "");
  const [customerEmail, setCustomerEmail] = useState(order.customer.email || "");
  const [customerPhone, setCustomerPhone] = useState(order.customer.phone || "");
  const [customerCompany, setCustomerCompany] = useState(
    order.customer.company || ""
  );

  // Phụ trách Thái Hương
  const [picName, setPicName] = useState(order.thaiHuongPIC.name || "");
  const [picEmail, setPicEmail] = useState(order.thaiHuongPIC.email || "");
  const [picPhone, setPicPhone] = useState(order.thaiHuongPIC.phone || "");

  const [notes, setNotes] = useState(order.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !customerName) {
      alert("Vui lòng điền tên sản phẩm và tên khách hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await orderService.updateOrder(order.id, {
        productName,
        quantity: quantity ? Number(quantity) : undefined,
        unit,
        startDate,
        expectedDeliveryDate,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
        },
        thaiHuongPIC: {
          name: picName,
          email: picEmail,
          phone: picPhone,
        },
        notes,
      });

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      alert(err.message || "Lỗi khi cập nhật thông tin đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            Chỉnh Sửa Thông Tin Đơn Hàng ({order.orderCode})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Thông tin sản phẩm & sản xuất */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Tên sản phẩm gia công *
              </label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Ngày bắt đầu:</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Giao dự kiến:</label>
                <Input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Số lượng:</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="VD: 5000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Quy cách:</label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="chai, hộp..."
                />
              </div>
            </div>
          </div>

          {/* 1. Thông tin Khách Hàng */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Thông tin Khách Hàng
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Tên khách hàng *</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Email khách hàng</label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Số điện thoại</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0988..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Công ty / Thương hiệu</label>
                <Input
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. Đại diện Thái Hương Phụ Trách */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Đại diện Thái Hương Phụ Trách
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Tên người phụ trách</label>
                <Input
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Email</label>
                <Input
                  type="email"
                  value={picEmail}
                  onChange={(e) => setPicEmail(e.target.value)}
                  placeholder="name@thaihuong.vn"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Số điện thoại</label>
                <Input
                  value={picPhone}
                  onChange={(e) => setPicPhone(e.target.value)}
                  placeholder="09..."
                />
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Ghi chú đơn hàng</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
