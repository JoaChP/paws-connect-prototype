import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '@/lib/server/db'
import { currentUser } from '@/lib/server/auth'
import { failure, guardOrigin, HttpError, rateLimit, readBody } from '@/lib/server/http'
import { messageSchema } from '@/lib/schemas'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const id = z.string().uuid().parse(new URL(request.url).searchParams.get('reportId'))
    const sql = db()
    const messages =
      await sql`SELECT m.id, m.user_id AS "userId", u.profile->>'name' AS name, m.content, m.created_at AS "createdAt" FROM messages m JOIN app_users u ON u.id=m.user_id WHERE report_id=${id} ORDER BY m.created_at DESC LIMIT 100`
    return NextResponse.json(
      { messages: messages.reverse() },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    return failure(error)
  }
}
export async function POST(request: Request) {
  try {
    guardOrigin(request)
    const user = await currentUser()
    if (!user) throw new HttpError(401, 'Inicia sesión para participar')
    const { reportId, content } = messageSchema.parse(await readBody(request))
    await rateLimit(`messages:${user.id}`, 40)
    const sql = db()
    const [report] =
      await sql`SELECT user_id, data->>'name' AS name FROM reports WHERE id=${reportId} AND resolved_at IS NULL`
    if (!report) throw new HttpError(404, 'Este reporte no está disponible para mensajes')
    await sql.transaction([
      sql`INSERT INTO messages(id,report_id,user_id,content) VALUES (${randomUUID()},${reportId},${user.id},${content})`,
      sql`INSERT INTO notifications(id,user_id,report_id,title,message) SELECT ${randomUUID()},${report.user_id},${reportId},${`Nuevo mensaje sobre ${report.name}`},${`${user.profile.name} publicó información en tu reporte.`} WHERE ${report.user_id} <> ${user.id}`,
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    return failure(error)
  }
}
