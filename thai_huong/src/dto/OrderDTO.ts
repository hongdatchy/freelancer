import { MilestoneDTO } from "./MilestoneDTO";

export type OrderStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface ThaiHuongPICInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface OrderDTO {
  id: string;
  orderCode: string;             // Ví dụ: TH-2026-001
  productName: string;           // Tên sản phẩm sản xuất (VD: Serum Trị Mụn BHA 2%)
  batchNumber?: string;          // Số lô sản xuất
  quantity?: number;             // Số lượng sản phẩm
  unit?: string;                 // chai/lọ/hộp
  customer: CustomerInfo;
  thaiHuongPIC: ThaiHuongPICInfo;
  startDate: string;             // Ngày bắt đầu đơn hàng (YYYY-MM-DD)
  expectedDeliveryDate: string;  // Ngày dự kiến giao hàng (YYYY-MM-DD)
  actualDeliveryDate?: string;   // Ngày giao hàng thực tế
  currentStep: number;           // Mốc hiện tại (1 -> 7)
  status: OrderStatus;
  milestones: MilestoneDTO[];
  trackingToken: string;         // Token bí mật để khách tra cứu trực tiếp
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderInput = Omit<OrderDTO, 'id' | 'createdAt' | 'updatedAt' | 'trackingToken' | 'currentStep' | 'status'> & {
  status?: OrderStatus;
  currentStep?: number;
};
