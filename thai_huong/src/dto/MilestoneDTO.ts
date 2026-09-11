export type MilestoneType =
  | 'HO_SO_CONG_BO'          // Mốc 1: Hồ sơ công bố (Cố định 25 - 28 ngày)
  | 'NHAP_NGUYEN_LIEU'       // Mốc 2: Nhập nguyên liệu
  | 'NHAP_BAO_BI'            // Mốc 3: Nhập bao bì
  | 'IN_DECAL_HOP'           // Mốc 4: In decal và hộp giấy
  | 'PHA_CHE'                // Mốc 5: Ngày pha chế
  | 'CHIET_ROT_DONG_GOI'     // Mốc 6: Ngày chiết rót đóng gói
  | 'GIAO_HANG';             // Mốc 7: Ngày giao hàng

export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';

export interface MilestoneNotifyConfig {
  sendEmail: boolean;
  sendNotification: boolean;
  remindDaysBefore: number;  // Báo trước X ngày
  lastNotifiedAt?: string;
}

export interface MilestoneDTO {
  id: string;
  stepNumber: number;          // 1 -> 7
  type: MilestoneType;
  title: string;
  description?: string;
  durationDays?: number;       // Mốc 1 cố định 25-28 ngày, các mốc khác linh hoạt
  startDate: string;           // YYYY-MM-DD
  endDate: string;             // YYYY-MM-DD
  completedAt?: string;        // Ngày hoàn thành thực tế
  status: MilestoneStatus;
  notes?: string;
  notifyConfig: MilestoneNotifyConfig;
}

export const MILESTONE_DEFINITIONS: Array<{
  stepNumber: number;
  type: MilestoneType;
  title: string;
  defaultDurationDays?: number;
  isFixedDuration?: boolean;
}> = [
  { stepNumber: 1, type: 'HO_SO_CONG_BO', title: 'Hồ sơ công bố', defaultDurationDays: 28, isFixedDuration: true },
  { stepNumber: 2, type: 'NHAP_NGUYEN_LIEU', title: 'Nhập nguyên liệu', defaultDurationDays: 7 },
  { stepNumber: 3, type: 'NHAP_BAO_BI', title: 'Nhập bao bì', defaultDurationDays: 7 },
  { stepNumber: 4, type: 'IN_DECAL_HOP', title: 'In decal và hộp giấy', defaultDurationDays: 5 },
  { stepNumber: 5, type: 'PHA_CHE', title: 'Ngày pha chế', defaultDurationDays: 2 },
  { stepNumber: 6, type: 'CHIET_ROT_DONG_GOI', title: 'Ngày chiết rót đóng gói', defaultDurationDays: 3 },
  { stepNumber: 7, type: 'GIAO_HANG', title: 'Ngày giao hàng', defaultDurationDays: 1 },
];
