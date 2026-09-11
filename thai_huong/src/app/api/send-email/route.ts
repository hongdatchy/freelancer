import { NextResponse } from "next/server";
import { generateMilestoneEmailHtml } from "@/lib/mail-template";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order, milestone, type, customMessage, trackingUrl, recipients } = body;

    if (!order || !milestone || !recipients || !recipients.length) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu đơn hàng, mốc hoặc email người nhận" },
        { status: 400 }
      );
    }

    const htmlContent = generateMilestoneEmailHtml({
      order,
      milestone,
      type: type || "UPCOMING",
      customMessage,
      trackingUrl,
    });

    const subject = `[Thái Hương] Cập nhật tiến độ Mốc #${milestone.stepNumber}: ${milestone.title} - Đơn ${order.orderCode}`;

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return NextResponse.json(
        { error: "Chưa cấu hình tài khoản SMTP_USER hoặc SMTP_PASS trong .env.local" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Dược Mỹ Phẩm Thái Hương" <${user}>`,
      to: recipients.join(", "),
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: `Đã gửi email thành công tới ${recipients.join(", ")}`,
      log: {
        id: `log-${Date.now()}`,
        orderId: order.id,
        orderCode: order.orderCode,
        milestoneTitle: milestone.title,
        stepNumber: milestone.stepNumber,
        channel: "EMAIL",
        recipients,
        subject,
        content: customMessage || "Cập nhật mốc tiến độ",
        status: "SENT",
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Lỗi gửi email SMTP:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi gửi email qua Gmail SMTP" },
      { status: 500 }
    );
  }
}
