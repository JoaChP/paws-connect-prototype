import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { currentUser } from '@/lib/server/auth'
import { failure } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ configured: false })
    const sql = db()
    const user = await currentUser()
    const uid = user?.id ?? null
    const [reports, registered, posts, notifications, counts] = await sql.transaction(
      [
        sql`SELECT r.id, r.user_id, r.data, r.created_at, r.resolved_at, u.profile->>'name' AS reporter FROM reports r JOIN app_users u ON u.id=r.user_id ORDER BY r.created_at DESC LIMIT 200`,
        sql`SELECT id, data FROM registered_pets WHERE user_id=${uid} ORDER BY created_at DESC`,
        sql`SELECT p.id, p.report_id, p.user_id, p.created_at, r.data, r.resolved_at, u.profile->>'name' AS author, u.profile->>'avatar' AS avatar, (SELECT count(*)::int FROM likes WHERE post_id=p.id) AS likes, EXISTS(SELECT 1 FROM likes WHERE post_id=p.id AND user_id=${uid}) AS liked, (SELECT count(*)::int FROM messages WHERE report_id=p.report_id) AS comments FROM posts p JOIN reports r ON r.id=p.report_id JOIN app_users u ON u.id=p.user_id ORDER BY p.created_at DESC LIMIT 100`,
        sql`SELECT id, report_id, title, message, read, created_at FROM notifications WHERE user_id=${uid} ORDER BY created_at DESC LIMIT 100`,
        sql`SELECT (SELECT count(*)::int FROM reports WHERE user_id=${uid}) AS reports, (SELECT count(*)::int FROM registered_pets WHERE user_id=${uid}) AS pets`,
      ],
      { readOnly: true, isolationLevel: 'RepeatableRead' },
    )
    return NextResponse.json(
      {
        configured: true,
        user: user
          ? {
              ...user.profile,
              id: user.id,
              email: user.email,
              joinedAt: user.created_at,
              petsCount: counts[0].pets,
              reportsCount: counts[0].reports,
              points: counts[0].reports * 20,
              badge: counts[0].reports >= 5 ? 'Rescatista comunitario' : 'Amigo de las mascotas',
            }
          : null,
        pets: reports.map((r) => ({
          ...r.data,
          id: r.id,
          ownerId: r.user_id,
          reportedBy: r.reporter,
          reportedAt: new Date(r.created_at).toLocaleString('es-CR', {
            timeZone: 'America/Costa_Rica',
          }),
          resolvedAt: r.resolved_at,
          caseNumber: r.id.slice(0, 8).toUpperCase(),
        })),
        registeredPets: registered.map((r) => ({ ...r.data, id: r.id })),
        posts: posts.map((p) => ({
          id: p.id,
          petId: p.report_id,
          userId: p.user_id,
          userName: p.author,
          userAvatar: p.avatar || '/avatar.svg',
          petName: p.data.name,
          petImage: p.data.image,
          type: p.resolved_at
            ? 'success'
            : p.data.status === 'shelter'
              ? 'adoption'
              : p.data.status,
          content: p.data.description,
          location: p.data.location,
          likes: p.likes,
          liked: p.liked,
          comments: p.comments,
          createdAt: new Date(p.created_at).toLocaleString('es-CR', {
            timeZone: 'America/Costa_Rica',
          }),
        })),
        notifications: notifications.map((n) => ({
          id: n.id,
          reportId: n.report_id,
          title: n.title,
          message: n.message,
          read: n.read,
          type: 'message',
          createdAt: new Date(n.created_at).toLocaleString('es-CR', {
            timeZone: 'America/Costa_Rica',
          }),
        })),
        activities: reports
          .filter((r) => r.user_id === uid)
          .map((r) => ({
            id: r.id,
            type: 'report',
            description: `Reportaste a ${r.data.name}`,
            date: r.created_at,
          })),
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    return failure(error)
  }
}
