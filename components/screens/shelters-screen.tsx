'use client'
import { ArrowLeft, Heart } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'
export function SheltersScreen({
  onNavigate,
  onBack,
}: {
  onNavigate: (s: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}) {
  const { pets } = useApp()
  const available = pets.filter((p) => p.status === 'shelter' && !p.resolvedAt)
  return (
    <div className="pb-24">
      <header className="flex items-center gap-3 border-b bg-white p-5">
        <button aria-label="Volver" onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Mascotas en adopción</h1>
      </header>
      <div className="p-5">
        <p className="mb-6 text-sm leading-6 text-muted-foreground">
          Conoce las mascotas reportadas por la comunidad que buscan hogar. Revisa la información de
          cada caso y contacta a la persona responsable.
        </p>
        {!available.length && (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <Heart className="mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">Todavía no hay reportes de adopción.</p>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((p) => (
            <button
              key={p.id}
              onClick={() => onNavigate('petDetail', { petId: p.id })}
              className="overflow-hidden rounded-2xl border bg-white text-left"
            >
              <img src={p.image} alt={p.name} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-muted-foreground">{p.location}</p>
                <p className="mt-3 text-sm text-primary">Conocer su historia →</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
