import { NextRequest, NextResponse } from 'next/server';
import process from 'process';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const url = request.nextUrl;

  const locale =
    url.searchParams.get('locale') ||
    process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;

  if (locale) {
    requestHeaders.set('locale', locale);
  }

  const token = request.cookies.get('jwt')?.value;

  // ===== 1. CÁC TRANG BẮT BUỘC ĐĂNG NHẬP MỚI ĐƯỢC VÀO =====
  const isProtectedRoute =
    url.pathname.startsWith('/elearning') ||
    url.pathname.startsWith('/schedule-management') ||
    url.pathname.startsWith('/teacher-training');

  // ===== 2. CHƯA LOGIN -> CỐ VÀO TRANG BẢO VỆ ➡ REDIRECT VỀ /login =====
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ===== 3. ĐÃ LOGIN -> CỐ VÀO TRANG CHỦ "/" ➡ REDIRECT VỀ /elearning (CHO PHÉP VÀO /login THOẢI MÁI) =====
  if (token && url.pathname === '/') {
    return NextResponse.redirect(new URL('/elearning', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
};