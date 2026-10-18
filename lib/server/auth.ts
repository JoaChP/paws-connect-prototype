import 'server-only'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { db } from './db'

const scrypt = promisify(scryptCallback)
const cookieName = 'paws_session'
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${hash.toString('hex')}`
}
export async function verifyPassword(password: string, encoded: string) {
  const [salt, hash] = encoded.split(':')
  const derived = (await scrypt(password, salt, 64)) as Buffer
  const expected = Buffer.from(hash, 'hex')
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}
const digest = (token: string) => createHash('sha256').update(token).digest('hex')
export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value
  if (!token) return null
  const sql = db()
  const rows =
    await sql`SELECT u.id, u.email, u.profile, u.created_at FROM sessions s JOIN app_users u ON u.id = s.user_id WHERE s.token_hash = ${digest(token)} AND s.expires_at > now()`
  return rows[0] ?? null
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  const sql = db()
  await sql`INSERT INTO sessions(token_hash, user_id, expires_at) VALUES (${digest(token)}, ${userId}, now() + interval '7 days')`
  ;(await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 604800,
  })
}
export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(cookieName)?.value
  if (token) {
    const sql = db()
    await sql`DELETE FROM sessions WHERE token_hash = ${digest(token)}`
  }
  jar.delete(cookieName)
}
