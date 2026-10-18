import 'server-only'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { db } from './db'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}
export function guardOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const expected = new URL(request.url)
  // Next may normalize request.url to localhost in development; Host is the
  // browser's actual destination and also supports Vercel custom domains.
  expected.host = request.headers.get('host') || expected.host
  if (!origin || origin !== expected.origin) throw new HttpError(403, 'Origen no permitido')
}
export async function readBody(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json'))
    throw new HttpError(415, 'Se requiere JSON')
  const reader = request.body?.getReader()
  if (!reader) throw new HttpError(400, 'Falta el contenido')
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 700_000) {
      await reader.cancel()
      throw new HttpError(413, 'La imagen es demasiado grande')
    }
    chunks.push(value)
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!body || typeof body !== 'object' || Array.isArray(body))
      throw new HttpError(400, 'Se requiere un objeto JSON')
    return body
  } catch {
    throw new HttpError(400, 'JSON no válido')
  }
}
export function failure(error: unknown) {
  if (error instanceof HttpError)
    return NextResponse.json({ error: error.message }, { status: error.status })
  if (error instanceof ZodError)
    return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
  if (error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED')
    return NextResponse.json(
      { error: 'La base de datos aún no está configurada. Puedes explorar la demostración.' },
      { status: 503 },
    )
  // Never send SQL, connection strings or stack traces to the client.
  console.error('PawsConnect request failed', error instanceof Error ? error.name : 'UnknownError')
  return NextResponse.json(
    { error: 'No pudimos completar la operación. Intenta de nuevo.' },
    { status: 500 },
  )
}
export async function rateLimit(key: string, limit: number) {
  const sql = db()
  const [row] =
    await sql`INSERT INTO rate_limits(key, attempts, reset_at) VALUES (${key}, 1, now() + interval '15 minutes') ON CONFLICT (key) DO UPDATE SET attempts = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.attempts + 1 END, reset_at = CASE WHEN rate_limits.reset_at < now() THEN now() + interval '15 minutes' ELSE rate_limits.reset_at END RETURNING attempts`
  if (row.attempts > limit) throw new HttpError(429, 'Demasiados intentos. Intenta en 15 minutos.')
}
