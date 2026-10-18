'use client'
import { useState } from 'react'
import {
  Search,
  Bell,
  MapPin,
  ArrowUpRight,
  Plus,
  ScanSearch,
  PawPrint,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react'
import { useApp, type Pet } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'

const labels = { lost: 'Se busca', found: 'Encontrada', shelter: 'En adopción' }
const badges = {
  lost: 'bg-[#fff1e7] text-[#9b471d]',
  found: 'bg-[#e2f0e5] text-[#245b3c]',
  shelter: 'bg-blue-50 text-blue-800',
}
export function DashboardScreen({
  onNavigate,
}: {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
}) {
  const {
    user,
    pets,
    notifications,
    authenticated,
    setSearchQuery,
    setRadiusFilter,
    setStatusFilter,
    demo,
  } = useApp()
  const [tab, setTab] = useState<'all' | 'lost' | 'found' | 'shelter'>('all')
  const [query, setQuery] = useState('')
  const active = pets.filter((p) => !p.resolvedAt)
  const visible = active.filter((p) => tab === 'all' || p.status === tab)
  const search = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(query)
    setRadiusFilter(500)
    setStatusFilter('all')
    onNavigate('map')
  }
  return (
    <div className="pb-24 md:pb-8">
      <header className="flex items-center justify-between border-b bg-white px-5 py-5 md:px-8">
        <div>
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
            PawsConnect · Costa Rica
          </p>
          <p className="mt-1 text-sm font-medium">
            {authenticated
              ? `Hola, ${user.name.split(' ')[0]}. Qué bueno tenerte aquí.`
              : 'Pequeñas acciones. Grandes reencuentros.'}
          </p>
        </div>
        <button
          aria-label={authenticated ? 'Ver notificaciones' : 'Iniciar sesión'}
          onClick={() => onNavigate(authenticated ? 'notifications' : 'login')}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-white"
        >
          <Bell size={18} />
          {notifications.some((n) => !n.read) && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
          )}
        </button>
      </header>
      <div className="p-4 md:p-8">
        <section className="relative grid overflow-hidden rounded-[1.75rem] bg-[#153e2d] text-white lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative z-10 p-7 sm:p-10 lg:p-11">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9ed9c]" /> JUNTOS, MÁS CERCA DE CASA
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Su camino a casa
              <br />
              <span className="text-[#d9ed9c]">empieza contigo.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
              Ayudemos a que cada mascota vuelva a donde pertenece. Encuentra, reporta y conecta con
              personas que también quieren ayudar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('report')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#d9ed9c] px-5 py-3 text-sm font-semibold text-[#153e2d]"
              >
                <Plus size={18} /> Crear un reporte
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm"
              >
                Explorar mapa <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
          <div className="relative hidden min-h-80 lg:block">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85"
              alt="Un golden retriever al aire libre"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#153e2d] via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-[#153e2d] backdrop-blur">
              <HeartHandshake size={22} className="mb-1" />
              <p className="text-sm font-semibold">Unidos por sus huellas.</p>
              <p className="text-xs text-muted-foreground">Una comunidad, un mismo propósito.</p>
            </div>
          </div>
        </section>
        <div className="my-6 grid grid-cols-3 gap-3">
          {[
            {
              value: active.filter((p) => p.status === 'lost').length,
              label: 'Buscando su hogar',
              icon: Search,
            },
            {
              value: active.filter((p) => p.status === 'found').length,
              label: 'Mascotas encontradas',
              icon: PawPrint,
            },
            {
              value: pets.filter((p) => p.resolvedAt).length,
              label: 'Casos resueltos',
              icon: HeartHandshake,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <s.icon size={20} />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={search}
          className="mb-8 flex items-center gap-3 rounded-2xl border bg-white p-2 pl-4"
        >
          <Search size={20} className="shrink-0 text-muted-foreground" />
          <input
            aria-label="Buscar por nombre, raza o ubicación"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por nombre, raza o ubicación…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
          />
          <button type="submit" className="rounded-xl bg-primary px-4 py-3 text-sm text-white">
            Buscar
          </button>
        </form>
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary">
                CADA REPORTE CUENTA
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Ayúdales a volver a casa
              </h2>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="flex items-center gap-2 text-sm font-medium text-primary"
            >
              Ver en el mapa <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="mb-5 flex gap-2 overflow-auto">
            {(
              [
                ['all', 'Todas'],
                ['lost', 'Perdidas'],
                ['found', 'Encontradas'],
                ['shelter', 'En adopción'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-pressed={tab === id}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium ${tab === id ? 'border-primary bg-primary text-white' : 'bg-white text-muted-foreground'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
              <PawPrint className="mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Una nueva comunidad empieza aquí</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Todavía no hay reportes en esta categoría. Tu primer reporte puede marcar la
                diferencia.
              </p>
              <button
                onClick={() => onNavigate('report')}
                className="mt-5 text-sm font-semibold text-primary"
              >
                Publicar un reporte →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3">
              {visible.map((p) => (
                <PetCard
                  key={p.id}
                  pet={p}
                  onClick={() => onNavigate('petDetail', { petId: p.id })}
                />
              ))}
            </div>
          )}
        </section>
        <section className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#d4e1cc] bg-[#edf3e8] p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <ScanSearch className="hidden shrink-0 text-primary sm:block" size={30} />
            <div>
              <h2 className="font-semibold">Una pista puede cambiarlo todo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compara reportes por características y cercanía.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('aiMatchList')}
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-primary"
          >
            Ver coincidencias <ArrowRight size={16} />
          </button>
        </section>
        <footer className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-5 text-xs text-muted-foreground">
          <span>PawsConnect · Hecho para reunir familias.</span>
          {!demo && (
            <a href="/?demo=1" className="font-medium text-primary">
              Explorar demostración →
            </a>
          )}
          <a
            href="https://github.com/JoaChP/paws-connect-prototype"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            Conoce el proyecto ↗
          </a>
        </footer>
      </div>
    </div>
  )
}
function PetCard({ pet, onClick }: { pet: Pet; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pet.image || '/placeholder.svg'}
          alt={pet.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badges[pet.status]}`}
        >
          {labels[pet.status]}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{pet.name}</h3>
          <ArrowUpRight size={17} className="text-muted-foreground" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{pet.breed}</p>
        <p className="mt-3 flex items-start gap-1 border-t pt-3 text-[11px] text-muted-foreground">
          <MapPin size={13} className="shrink-0" />
          {pet.location}
        </p>
      </div>
    </button>
  )
}
