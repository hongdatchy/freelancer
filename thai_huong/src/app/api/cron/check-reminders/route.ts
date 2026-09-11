import { NextResponse } from "next/server";
import { scanAndSendDueReminders } from "@/service/cron-worker";

export async function GET() {
  try {
    // Kích hoạt quét thủ công hoặc qua HTTP request
    await scanAndSendDueReminders();
    return NextResponse.json({
      success: true,
      message: "Đã thực hiện quét và kiểm tra lịch thông báo thành công.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Lỗi khi quét lịch thông báo" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
