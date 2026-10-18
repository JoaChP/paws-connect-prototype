'use client'
import { ArrowLeft, Bell } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'
export function NotificationsScreen({
  onNavigate,
  onBack,
}: {
  onNavigate: (s: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}) {
  const { notifications, markAsRead, markAllAsRead } = useApp()
  return (
    <div className="pb-24">
      <header className="flex items-center gap-3 border-b bg-white p-5">
        <button aria-label="Volver" onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="flex-1 text-xl font-semibold">Notificaciones</h1>
        {notifications.some((n) => !n.read) && (
          <button className="text-xs text-primary" onClick={() => void markAllAsRead()}>
            Marcar todas leídas
          </button>
        )}
      </header>
      <div className="space-y-3 p-5">
        {notifications.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            <Bell className="mx-auto mb-3" />
            <p className="text-sm">
              Estás al día. Te avisaremos cuando alguien publique una pista en tus reportes.
            </p>
          </div>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={async () => {
              await markAsRead(n.id)
              if (n.reportId) onNavigate('chat', { petId: n.reportId })
            }}
            className={`w-full rounded-xl border p-4 text-left ${n.read ? 'bg-white' : 'border-primary bg-secondary'}`}
          >
            <p className="font-semibold">{n.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">{n.createdAt}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
