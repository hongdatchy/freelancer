"use client";

import { useState } from "react";
import { CreateOrderInput } from "@/dto/OrderDTO";
import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { orderService, generateDefaultMilestones } from "@/service/order-service";
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
import { format, addDays, parseISO, differenceInDays } from "date-fns";
import {
  addDaysExcludingSunday,
  differenceInDaysExcludingSunday,
} from "@/lib/utils";
import { PlusCircle, Settings2, Plus, Trash2, Mail } from "lucide-react";

interface OrderFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OrderFormModal({ open, onClose, onSuccess }: OrderFormModalProps) {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [orderCode, setOrderCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("");

  // Khách hàng
  const [customerName, setCustomerName] = useState("");
  const [customerEmails, setCustomerEmails] = useState<string[]>([""]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");

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
  const [picName, setPicName] = useState("Nguyễn Thị Thu Thảo");
  const [picEmail, setPicEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Tùy chọn nhập tay cả 7 mốc
  const [isCustomMilestones, setIsCustomMilestones] = useState(false);
  const [customMilestones, setCustomMilestones] = useState<MilestoneDTO[]>(() =>
    generateDefaultMilestones(todayStr)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val) {
      setCustomMilestones(generateDefaultMilestones(val));
    }
  };

  const handleToggleCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsCustomMilestones(checked);
    if (checked) {
      const base = startDate || format(new Date(), "yyyy-MM-dd");
      setCustomMilestones(generateDefaultMilestones(base));
    }
  };

  const handleMilestoneChange = (
    index: number,
    field: "startDate" | "endDate",
    val: string
  ) => {
    setCustomMilestones((prev) => {
      const next = [...prev];
      // Nếu là mốc 1 (Hồ sơ công bố) và đổi ngày bắt đầu: Tự động gán ngày xong là + 28 ngày làm việc (bỏ qua Chủ Nhật)
      if (index === 0 && field === "startDate" && val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        try {
          const autoEndDate = format(addDaysExcludingSunday(parseISO(val), 28), "yyyy-MM-dd");
          next[0] = { ...next[0], startDate: val, endDate: autoEndDate, durationDays: 28 };
          return next;
        } catch {}
      }
      // Nếu người dùng tự chỉnh sửa ngày kết thúc khác chuẩn:
      if (field === "endDate" && val && next[index].startDate && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        try {
          const customDuration = differenceInDaysExcludingSunday(parseISO(val), parseISO(next[index].startDate));
          next[index] = { ...next[index], [field]: val, durationDays: Math.max(0, customDuration) };
          return next;
        } catch {}
      }
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = customerEmails.map((e) => e.trim()).filter(Boolean);
    if (!productName || !customerName || validEmails.length === 0) {
      alert("Vui lòng điền tên sản phẩm, tên khách hàng và ít nhất 1 email nhận thông báo");
      return;
    }

    setIsSubmitting(true);
    try {
      const start = startDate ? new Date(startDate) : new Date();
      const finalMilestones = isCustomMilestones ? customMilestones : [];
      const expectedDeliveryDate =
        isCustomMilestones && customMilestones[customMilestones.length - 1]?.endDate
          ? customMilestones[customMilestones.length - 1].endDate
          : format(addDays(start, 46), "yyyy-MM-dd");

      const input: CreateOrderInput = {
        orderCode,
        productName,
        quantity: quantity ? Number(quantity) : undefined,
        unit,
        startDate: startDate || format(new Date(), "yyyy-MM-dd"),
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
        },
        notes,
        milestones: finalMilestones,
      };

      await orderService.createOrder(input);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Lỗi tạo đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Tạo Đơn Hàng Gia Công & Khởi Tạo Timeline 7 Mốc
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Mã đơn hàng *</label>
              <Input
                placeholder="VD: TH-2026-001"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Ngày bắt đầu đơn (dd/mm/yyyy) *</label>
              <DateInputVN
                value={startDate}
                onChange={handleStartDateChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Tên sản phẩm gia công *</label>
            <Input
              placeholder="VD: Kem Dưỡng Trắng Da Ban Đêm Peptide"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Số lượng sản xuất</label>
              <Input
                type="number"
                placeholder="VD: 5000"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Quy cách đóng gói</label>
              <Input
                placeholder="chai, hũ, tuýp..."
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          {/* Phần thông tin Khách hàng */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Thông tin Khách hàng (Nhận thông báo & theo dõi)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Tên khách hàng *</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Họ và tên khách"
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
                <label className="text-xs text-slate-600 block mb-1">Công ty / Nhãn hàng</label>
                <Input
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  placeholder="Thương hiệu mỹ phẩm"
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

          {/* Phần thông tin Phụ trách Thái Hương */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Người phụ trách phía Thái Hương
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Tên người phụ trách</label>
                <Input
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Email Thái Hương</label>
                <Input
                  type="email"
                  value={picEmail}
                  onChange={(e) => setPicEmail(e.target.value)}
                  placeholder="production@thaihuong.vn"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Ghi chú đơn hàng</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Yêu cầu về bao bì, tiêu chuẩn tem nhãn..."
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phần tùy chọn nhập tay 7 mốc */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                  3. Thiết lập ngày cho 7 mốc sản xuất
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mặc định hệ thống tự tính ngày. Bật tùy chọn nếu muốn tự nhập tay ngày cho từng mốc.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm shrink-0">
                <input
                  type="checkbox"
                  checked={isCustomMilestones}
                  onChange={handleToggleCustom}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-blue-700">
                  Tự nhập tay cả 7 mốc
                </span>
              </label>
            </div>

            {isCustomMilestones && (
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                {customMilestones.map((m, idx) => (
                  <div
                    key={m.stepNumber}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          {m.stepNumber}
                        </span>
                        {m.title}
                      </span>
                      {m.stepNumber === 1 && (
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-medium">
                          Quy chuẩn 28 ngày
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">
                          Ngày bắt đầu (dd/mm/yyyy):
                        </label>
                        <DateInputVN
                          value={m.startDate}
                          onChange={(val) =>
                            handleMilestoneChange(idx, "startDate", val)
                          }
                          className="h-8 text-xs bg-slate-50"
                          required={isCustomMilestones}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">
                          Ngày dự kiến xong (dd/mm/yyyy):
                        </label>
                        <DateInputVN
                          value={m.endDate}
                          onChange={(val) =>
                            handleMilestoneChange(idx, "endDate", val)
                          }
                          className="h-8 text-xs bg-slate-50"
                          required={isCustomMilestones}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting
                ? "Đang tạo..."
                : isCustomMilestones
                ? "Tạo Đơn Với 7 Mốc Đã Nhập"
                : "Tạo Đơn & Sinh Timeline 7 Mốc"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
