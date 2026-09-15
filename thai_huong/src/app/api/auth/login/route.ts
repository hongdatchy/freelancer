import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-token";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail =
      process.env.ADMIN_EMAIL || "thaontt.thaihuong@gmail.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "thao2002@";

    // Kiểm tra đăng nhập Admin
    const isEmailValid =
      email &&
      (email.trim().toLowerCase() === expectedEmail.toLowerCase() ||
        email.trim().toLowerCase() === "thaontt" ||
        email.trim().toLowerCase() === "admin");
    const isPasswordValid = password && password === expectedPassword;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Tài khoản hoặc mật khẩu không chính xác" },
        { status: 401 },
      );
    }

    // Tạo JWT session token bảo mật
    const token = await createSessionToken({
      email: expectedEmail,
      role: "ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        email: expectedEmail,
        role: "ADMIN",
      },
    });

    // Thiết lập cookie HttpOnly an toàn
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi đăng nhập" },
      { status: 500 },
    );
  }
}
