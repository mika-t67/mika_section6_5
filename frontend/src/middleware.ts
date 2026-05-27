import { NextRequest, NextResponse } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
 
  // /admin/login は認証不要
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }
 
  // /admin 以下のルートを保護
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value
 
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*'],
}
 