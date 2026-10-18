'use client'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Send, MessageCircle, RefreshCw } from 'lucide-react'
import { api, useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'
interface Message {
  id: string
  userId: string
  name: string
  content: string
  createdAt: string
}
export function ChatScreen({
  reportId,
  onNavigate,
  onBack,
}: {
  reportId?: string
  onNavigate: (s: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}) {
  const { user, authenticated, pets } = useApp()
  const pet = pets.find((p) => p.id === reportId)
  const [messages, setMessages] = useState<Message[]>([]),
    [content, setContent] = useState(''),
    [error, setError] = useState(''),
    [pending, setPending] = useState(false)
  const load = useCallback(async () => {
    if (!reportId || !/^[0-9a-f-]{36}$/i.test(reportId)) return
    try {
      const data = await api<{ messages: Message[] }>(
        `/api/messages?reportId=${encodeURIComponent(reportId)}`,
      )
      setMessages(data.messages)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos cargar los mensajes')
    }
  }, [reportId])
  useEffect(() => {
    void load()
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') void load()
    }, 15000)
    return () => clearInterval(interval)
  }, [load])
  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || pending) return
    setPending(true)
    try {
      await api('/api/messages', { method: 'POST', body: JSON.stringify({ reportId, content }) })
      setContent('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar')
    } finally {
      setPending(false)
    }
  }
  if (!pet)
    return (
      <div className="p-8">
        <h1 className="font-semibold">Selecciona un reporte para participar</h1>
        <button onClick={() => onNavigate('map')} className="mt-4 text-primary">
          Explorar reportes →
        </button>
      </div>
    )
  return (
    <div className="flex min-h-[80vh] flex-col pb-24">
      <header className="flex items-center gap-4 border-b bg-white p-5">
        <button aria-label="Volver" onClick={onBack}>
          <ArrowLeft />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold">Información sobre {pet.name}</h1>
          <p className="text-xs text-muted-foreground">
            Mensajes públicos del reporte · Se actualizan cada 15 segundos
          </p>
        </div>
        <button aria-label="Actualizar mensajes" onClick={() => void load()}>
          <RefreshCw size={18} />
        </button>
      </header>
      <p className="m-4 rounded-xl bg-secondary p-3 text-xs leading-5">
        Comparte pistas y avistamientos. Estos mensajes son visibles para toda la comunidad. Evita
        publicar información personal sensible.
      </p>
      <div aria-live="polite" className="flex-1 space-y-3 p-4">
        {messages.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">
            <MessageCircle className="mx-auto mb-3" />
            <p className="text-sm">Aún no hay mensajes. Una pista puede ayudar.</p>
          </div>
        )}
        {messages.map((m) => (
          <article
            key={m.id}
            className={`max-w-xl rounded-2xl border p-4 ${m.userId === user.id ? 'ml-auto bg-secondary' : 'bg-white'}`}
          >
            <p className="text-xs font-semibold text-primary">{m.name}</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{m.content}</p>
            <time className="mt-2 block text-[10px] text-muted-foreground">
              {new Date(m.createdAt).toLocaleString('es-CR')}
            </time>
          </article>
        ))}
      </div>
      {error && (
        <p role="alert" className="mx-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {pet.resolvedAt ? (
        <p className="p-5 text-sm text-primary">
          Este caso está resuelto. Los mensajes permanecen disponibles para consulta.
        </p>
      ) : authenticated ? (
        <form onSubmit={send} className="m-4 flex gap-2">
          <input
            aria-label="Mensaje público"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1500}
            required
            placeholder="Comparte una pista…"
            className="min-w-0 flex-1 rounded-xl border bg-white p-3 text-sm"
          />
          <button
            disabled={pending || !content.trim()}
            aria-label="Enviar mensaje"
            className="rounded-xl bg-primary p-3 text-white disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      ) : (
        <button
          onClick={() => onNavigate('login')}
          className="m-4 rounded-xl bg-primary p-3 text-sm text-white"
        >
          Inicia sesión para participar
        </button>
      )}
    </div>
  )
}
