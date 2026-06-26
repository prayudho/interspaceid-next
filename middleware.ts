import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET ?? ''
  if (s.length < 32) throw new Error('JWT_SECRET not configured')
  return new TextEncoder().encode(s)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    try {
      const { payload } = await jwtVerify(token, getSecret())
      // Require isAdmin === 1 at the edge — non-admin logins cannot access admin routes
      if ((payload as { isAdmin?: number }).isAdmin !== 1) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
