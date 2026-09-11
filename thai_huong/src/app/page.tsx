"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/state-manager/order-store";
import { OrderTable } from "@/components/custom/orders/order-table";
import { OrderFormModal } from "@/components/custom/orders/order-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const {
    orders,
    isLoading,
    fetchOrders,
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
  } = useOrderStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Bộ lọc tìm kiếm
  const filteredOrders = orders.filter((order) => {
    const matchesKeyword =
      order.orderCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesKeyword && matchesStatus;
  });

  // Số liệu tổng quan
  const totalOrders = orders.length;
  const inProgressCount = orders.filter((o) => o.status === "IN_PROGRESS").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const delayedCount = orders.filter((o) => o.status === "DELAYED").length;

  return (
    <div className="space-y-6">
      {/* Top action banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Quản Lý Tiến Độ Sản Xuất
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tiến độ 7 mốc chuẩn và gửi thông báo nhắc lịch cho Khách hàng & Thái Hương.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm h-11 px-5"
        >
          <PlusCircle className="w-4 h-4" />
          Tạo Đơn Hàng Mới
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "ALL" ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tổng số đơn</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalOrders}</p>
        </div>

        <div
          onClick={() => setStatusFilter("IN_PROGRESS")}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "IN_PROGRESS" ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Đang sản xuất</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">{inProgressCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("COMPLETED")}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "COMPLETED" ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Đã bàn giao</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{completedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("DELAYED")}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "DELAYED" ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Chậm tiến độ</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{delayedCount}</p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Tìm theo mã đơn, tên sản phẩm, khách..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-9 bg-slate-50/50 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "IN_PROGRESS", label: "Đang sản xuất" },
            { key: "COMPLETED", label: "Đã hoàn thành" },
            { key: "DELAYED", label: "Chậm tiến độ" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === item.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng danh sách đơn hàng */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Đang tải dữ liệu tiến độ sản xuất...
        </div>
      ) : (
        <OrderTable orders={filteredOrders} onOrderDeleted={fetchOrders} />
      )}

      {/* Modal tạo đơn hàng */}
      <OrderFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchOrders();
        }}
      />
    </div>
  );
}
