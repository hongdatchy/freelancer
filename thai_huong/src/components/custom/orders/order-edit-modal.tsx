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
import { DateInputVN } from "@/components/custom/common/date-input-vn";
import { Edit3, Plus, Trash2, Mail } from "lucide-react";

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
  const [customerEmails, setCustomerEmails] = useState<string[]>(() => {
    if (Array.isArray(order.customer.emails) && order.customer.emails.length > 0) {
      return order.customer.emails;
    }
    if (order.customer.email) {
      const split = order.customer.email.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
      return split.length > 0 ? split : [""];
    }
    return [""];
  });
  const [customerPhone, setCustomerPhone] = useState(order.customer.phone || "");
  const [customerCompany, setCustomerCompany] = useState(
    order.customer.company || ""
  );

  const handleAddEmail = () => {
    setCustomerEmails((prev) => [...prev, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    setCustomerEmails((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.length > 0 ? next : [""];
    });
  };

  const handleEmailChange = (index: number, val: string) => {
    setCustomerEmails((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

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

    const validEmails = customerEmails.map((e) => e.trim()).filter(Boolean);

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
          email: validEmails[0] || "",
          emails: validEmails,
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
                <label className="text-xs font-semibold text-slate-700">Ngày bắt đầu (dd/mm/yyyy):</label>
                <DateInputVN
                  value={startDate}
                  onChange={setStartDate}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Giao dự kiến (dd/mm/yyyy):</label>
                <DateInputVN
                  value={expectedDeliveryDate}
                  onChange={setExpectedDeliveryDate}
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
                <label className="text-xs text-slate-600 block mb-1">Số điện thoại</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0988..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-600 block mb-1">Công ty / Thương hiệu</label>
                <Input
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                />
              </div>
            </div>

            {/* Danh sách email khách hàng nhận thông báo */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Danh sách Email nhận thông báo của khách hàng *
                </label>
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  Thêm email
                </button>
              </div>

              <div className="space-y-2">
                {customerEmails.map((email, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(idx, e.target.value)}
                      placeholder={idx === 0 ? "Email chính (VD: giamdoc@hoasen.vn)" : `Email phụ ${idx} (VD: thumua@hoasen.vn)`}
                      className="h-9 text-xs bg-white flex-1"
                      required={idx === 0}
                    />
                    {customerEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                        title="Xóa email này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                💡 Hệ thống sẽ tự động gửi email thông báo tiến độ đồng thời cho tất cả các địa chỉ email của khách hàng ở trên.
              </p>
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
