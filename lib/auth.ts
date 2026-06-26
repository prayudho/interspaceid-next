import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export type AdminSession = {
  userId: number
  email: string
  name: string
  isAdmin: number
}

export const COOKIE_NAME = 'admin_session'

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET env var must be set and at least 32 characters')
  }
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHENTICATED')
  if (session.isAdmin !== 1) throw new Error('FORBIDDEN')
  return session
}
