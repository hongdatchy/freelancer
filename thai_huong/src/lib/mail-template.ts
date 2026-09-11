import { OrderDTO } from "@/dto/OrderDTO";
import { MilestoneDTO } from "@/dto/MilestoneDTO";
import { formatDateVN } from "./utils";

export function generateMilestoneEmailHtml(params: {
  order: OrderDTO;
  milestone: MilestoneDTO;
  type: "UPCOMING" | "COMPLETED" | "DELAYED" | "MANUAL_ALERT";
  customMessage?: string;
  trackingUrl?: string;
}): string {
  const { order, milestone, type, customMessage, trackingUrl } = params;

  let badgeColor = "#2563eb";
  let statusText = "Thông báo tiến độ";

  switch (type) {
    case "UPCOMING":
      badgeColor = "#f59e0b";
      statusText = "Sắp đến hạn mốc sản xuất";
      break;
    case "COMPLETED":
      badgeColor = "#10b981";
      statusText = "Đã hoàn thành mốc";
      break;
    case "DELAYED":
      badgeColor = "#ef4444";
      statusText = "Cảnh báo chậm tiến độ";
      break;
    case "MANUAL_ALERT":
      badgeColor = "#3b82f6";
      statusText = "Cập nhật tiến độ sản xuất";
      break;
  }

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #1e3a8a; padding: 24px; color: #ffffff; text-align: center; }
    .header h1 { margin: 0 0 8px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 24px; }
    .status-badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; color: #ffffff; background-color: ${badgeColor}; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
    .card { background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .value { font-weight: 600; color: #0f172a; text-align: right; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; margin-top: 16px; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 16px; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CÔNG TY CỔ PHẦN DƯỢC MỸ PHẨM THÁI HƯƠNG</h1>
      <p>Hệ thống Theo dõi & Cập nhật Tiến độ Sản xuất</p>
    </div>
    <div class="content">
      <div class="status-badge">${statusText}</div>
      <h2 style="margin: 0 0 16px 0; font-size: 18px;">Mốc #${milestone.stepNumber}: ${milestone.title}</h2>
      
      ${customMessage ? `<p style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 16px; font-size: 14px; border-radius: 4px;">${customMessage}</p>` : ''}

      <div class="card">
        <div class="row"><span class="label">Mã đơn hàng:</span><span class="value">${order.orderCode}</span></div>
        <div class="row"><span class="label">Tên sản phẩm:</span><span class="value">${order.productName}</span></div>
        <div class="row"><span class="label">Khách hàng:</span><span class="value">${order.customer.name}</span></div>
        <div class="row"><span class="label">Thời gian bắt đầu:</span><span class="value">${formatDateVN(milestone.startDate)}</span></div>
        <div class="row"><span class="label">Thời gian dự kiến hoàn thành:</span><span class="value">${formatDateVN(milestone.endDate)}</span></div>
        ${milestone.durationDays ? `<div class="row"><span class="label">Thời lượng dự kiến:</span><span class="value">${milestone.durationDays} ngày</span></div>` : ''}
        <div class="row"><span class="label">Phụ trách Thái Hương:</span><span class="value">${order.thaiHuongPIC.name} (${order.thaiHuongPIC.email})</span></div>
      </div>

      ${trackingUrl ? `
      <div style="text-align: center;">
        <a href="${trackingUrl}" class="btn" target="_blank">Xem Chi Tiết Timeline Tiến Độ Trực Tuyến</a>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>Email này được gửi tự động từ Hệ thống Quản lý Tiến độ Thái Hương.<br>Nếu có bất kỳ thắc mắc nào, vui lòng phản hồi email này hoặc liên hệ hotline phòng sản xuất.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
