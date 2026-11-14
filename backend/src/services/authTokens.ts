import jwt from 'jsonwebtoken'

export const authCookieName = 'visiolab_session'
const isProduction = process.env.NODE_ENV === 'production'

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
  path: '/api',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export function getAuthSecret() {
  const secret = process.env.JWT_SECRET
  return secret && Buffer.byteLength(secret, 'utf8') >= 32 ? secret : undefined
}

export function createAuthToken(userId: string, secret: string) {
  return jwt.sign({}, secret, { subject: userId, expiresIn: '7d' })
}
