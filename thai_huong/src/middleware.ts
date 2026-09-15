import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Cho phép truy cập tự do các file tĩnh và tài nguyên hệ thống
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname === "/manifest.json" ||
    pathname === "/firebase-messaging-sw.js"
  ) {
    return NextResponse.next();
  }

  // 2. Cho phép truy cập tự do trang tra cứu tiến độ của Khách Hàng (/track/...)
  if (pathname.startsWith("/track")) {
    return NextResponse.next();
  }

  // 3. Cho phép các API xác thực và API hệ thống
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/cron") || pathname.startsWith("/api/send-email")) {
    return NextResponse.next();
  }

  // 4. Kiểm tra phiên đăng nhập của Admin
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = !!session;

  // 5. Nếu đang ở trang Đăng nhập (/login):
  if (pathname === "/login") {
    if (isAuthenticated) {
      // Nếu đã đăng nhập thì tự động chuyển hướng về trang chủ Admin
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 6. Các trang Quản trị còn lại ('/', '/orders/*'): Bắt buộc đăng nhập
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Áp dụng middleware cho mọi request trừ static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
