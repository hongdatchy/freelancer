import { NextRequest, NextResponse } from 'next/server';
import process from 'process';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const url = request.nextUrl;
  const searchParams = url.searchParams;
  const locale = searchParams.get('locale') || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;
  if(locale){
    requestHeaders.set('locale', locale);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
