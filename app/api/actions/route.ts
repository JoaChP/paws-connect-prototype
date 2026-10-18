import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '@/lib/server/db'
import { currentUser } from '@/lib/server/auth'
import { failure, guardOrigin, HttpError, rateLimit, readBody } from '@/lib/server/http'
import { profileSchema, registeredPetSchema, reportSchema } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    guardOrigin(request)
    const user = await currentUser()
    if (!user) throw new HttpError(401, 'Inicia sesión para guardar cambios')
    const { action, id, data } = await readBody(request)
    await rateLimit(`write:${user.id}`, 100)
    const sql = db()
    let result = {}
    if (action === 'profile') {
      const profile = profileSchema.parse(data)
      await sql`UPDATE app_users SET profile=${JSON.stringify(profile)}::jsonb WHERE id=${user.id}`
    } else if (action === 'createReport') {
      const report = reportSchema.parse(data)
      const reportId = randomUUID()
      await sql.transaction([
        sql`INSERT INTO reports(id,user_id,data) VALUES (${reportId},${user.id},${JSON.stringify(report)}::jsonb)`,
        sql`INSERT INTO posts(id,report_id,user_id) VALUES (${randomUUID()},${reportId},${user.id})`,
      ])
      result = { ...report, id: reportId, reportedAt: new Date().toISOString() }
    } else if (action === 'createRegisteredPet') {
      const pet = registeredPetSchema.parse(data)
      await sql`INSERT INTO registered_pets(id,user_id,data) VALUES (${randomUUID()},${user.id},${JSON.stringify(pet)}::jsonb)`
    } else {
      if (
        ![
          'updateReport',
          'resolveReport',
          'deleteReport',
          'updateRegisteredPet',
          'deleteRegisteredPet',
          'like',
          'readNotification',
          'readAllNotifications',
        ].includes(action)
      )
        throw new HttpError(400, 'Acción no válida')
      if (action !== 'readAllNotifications') z.string().uuid().parse(id)
      if (action === 'updateReport') {
        const report = reportSchema.parse(data)
        const rows =
          await sql`UPDATE reports SET data=${JSON.stringify(report)}::jsonb WHERE id=${id} AND user_id=${user.id} RETURNING id`
        if (!rows.length) throw new HttpError(404, 'Reporte no encontrado')
      } else if (action === 'resolveReport') {
        const rows =
          await sql`UPDATE reports SET resolved_at=now() WHERE id=${id} AND user_id=${user.id} RETURNING id`
        if (!rows.length) throw new HttpError(404, 'Reporte no encontrado')
      } else if (action === 'deleteReport') {
        const rows =
          await sql`DELETE FROM reports WHERE id=${id} AND user_id=${user.id} RETURNING id`
        if (!rows.length) throw new HttpError(404, 'Reporte no encontrado')
      } else if (action === 'updateRegisteredPet') {
        const pet = registeredPetSchema.parse(data)
        const rows =
          await sql`UPDATE registered_pets SET data=${JSON.stringify(pet)}::jsonb WHERE id=${id} AND user_id=${user.id} RETURNING id`
        if (!rows.length) throw new HttpError(404, 'Mascota no encontrada')
      } else if (action === 'deleteRegisteredPet') {
        const rows =
          await sql`DELETE FROM registered_pets WHERE id=${id} AND user_id=${user.id} RETURNING id`
        if (!rows.length) throw new HttpError(404, 'Mascota no encontrada')
      } else if (action === 'like') {
        z.boolean().parse(data?.liked)
        if (data.liked)
          await sql`INSERT INTO likes(post_id,user_id) VALUES (${id},${user.id}) ON CONFLICT DO NOTHING`
        else await sql`DELETE FROM likes WHERE post_id=${id} AND user_id=${user.id}`
      } else if (action === 'readNotification') {
        await sql`UPDATE notifications SET read=true WHERE id=${id} AND user_id=${user.id}`
      } else if (action === 'readAllNotifications') {
        await sql`UPDATE notifications SET read=true WHERE user_id=${user.id}`
      }
    }
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    return failure(error)
  }
}
