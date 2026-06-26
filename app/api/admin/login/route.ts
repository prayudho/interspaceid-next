import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE_NAME } from '@/lib/auth'
import { getUserByEmail } from '@/lib/queries'
import { rateLimit } from '@/lib/rate-limit'
import { isValidEmail } from '@/lib/validate'

// 10 attempts per 15 minutes per IP
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000

const GENERIC_ERROR = 'Invalid email or password'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const limiter = rateLimit(`login:${ip}`, MAX_ATTEMPTS, WINDOW_MS)

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limiter.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  const user = await getUserByEmail(email)

  // Always run bcrypt compare to prevent timing attacks
  const hashToCheck = user?.udafPassword?.replace(/^\$2y\$/, '$2b$') ?? '$2b$12$invalidhashpadding000000000000000000000000000000000'
  const valid = user ? await bcrypt.compare(password, hashToCheck) : false

  if (!valid || !user) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  // Only admin users (isAdmin === 1) may access the admin panel
  if (user.udafIsAdmin !== 1) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  const token = await signToken({
    userId: user.udafId,
    email: user.udafEmail,
    name: user.udafName,
    isAdmin: user.udafIsAdmin,
  })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
