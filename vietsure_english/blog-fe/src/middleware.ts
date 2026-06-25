import { NextRequest, NextResponse } from 'next/server';
import process from 'process';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const url = request.nextUrl;

  const locale =
    url.searchParams.get('locale') ||
    process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;

  if (locale) {
    requestHeaders.set('locale', locale);
  }

  const token = request.cookies.get('jwt')?.value;

  const isProtectedRoute =
    url.pathname.startsWith('/elearning') ||
    url.pathname.startsWith('/schedule-management') ||
    url.pathname.startsWith('/teacher-training') ||
    url.pathname.startsWith('/classroom');

  // ===== 1. CHƯA LOGIN -> CHỈ ĐƯỢC VÀO "/" =====
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ===== 2. ĐÃ LOGIN -> CHỈ ĐƯỢC VÀO PROTECTED =====
  const isPublicRoute = !isProtectedRoute;

  if (token && isPublicRoute ) {
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