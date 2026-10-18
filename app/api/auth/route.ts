import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/server/db'
import { createSession, destroySession, hashPassword, verifyPassword } from '@/lib/server/auth'
import { failure, guardOrigin, HttpError, rateLimit, readBody } from '@/lib/server/http'
import { credentialsSchema } from '@/lib/schemas'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  try {
    guardOrigin(request)
    const body = await readBody(request)
    const input = credentialsSchema.parse(body)
    const action = body.action
    if (!['login', 'register'].includes(action)) throw new HttpError(400, 'Acción no válida')
    await rateLimit(`auth:${input.email}`, 15)
    // Vercel overwrites x-vercel-forwarded-for; do not trust arbitrary client IP headers.
    const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0] ?? 'local'
    await rateLimit(`auth-ip:${ip}`, 60)
    const sql = db()
    if (action === 'register') {
      if (!input.name) throw new HttpError(400, 'Indica tu nombre')
      const id = randomUUID()
      const profile = {
        name: input.name,
        phone: '',
        location: 'Costa Rica',
        bio: '',
        avatar: '/avatar.svg',
      }
      const rows =
        await sql`INSERT INTO app_users(id, email, password_hash, profile) VALUES (${id}, ${input.email}, ${await hashPassword(input.password)}, ${JSON.stringify(profile)}::jsonb) ON CONFLICT (email) DO NOTHING RETURNING id`
      if (!rows.length)
        throw new HttpError(
          409,
          'No se pudo crear la cuenta con este correo. Prueba iniciar sesión.',
        )
      await createSession(id)
    } else {
      const [user] = await sql`SELECT id, password_hash FROM app_users WHERE email = ${input.email}`
      // Perform the same expensive hash for unknown accounts.
      const encoded = user?.password_hash ?? `${'0'.repeat(32)}:${'0'.repeat(128)}`
      const valid = await verifyPassword(input.password, encoded)
      if (!user || !valid) throw new HttpError(401, 'Correo o contraseña incorrectos')
      await createSession(user.id)
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    return failure(error)
  }
}
export async function DELETE(request: Request) {
  try {
    guardOrigin(request)
    await destroySession()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return failure(error)
  }
}
