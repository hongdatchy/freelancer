export type NotificationChannel = 'EMAIL' | 'BROWSER_PUSH' | 'SYSTEM';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface NotificationLogDTO {
  id: string;
  orderId: string;
  orderCode: string;
  milestoneTitle: string;
  stepNumber: number;
  channel: NotificationChannel;
  recipients: string[];           // Danh sách email hoặc token nhận
  subject: string;
  content: string;
  status: NotificationStatus;
  sentAt?: string;
  error?: string;
  createdAt: string;
}
