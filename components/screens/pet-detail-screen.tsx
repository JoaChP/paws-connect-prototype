'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Share2, MapPin, Clock, Ruler, Phone, Eye, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'
import dynamic from 'next/dynamic'
import { shareReport } from '@/lib/share'
import { toast } from 'sonner'

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
})
const VectorMapLayer = dynamic(() => import('@/components/vector-map-layer'), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {
  ssr: false,
})

interface PetDetailScreenProps {
  petId?: string
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}

export function PetDetailScreen({ petId, onNavigate, onBack }: PetDetailScreenProps) {
  const { pets, user, resolvePet, deletePet } = useApp()
  const [isClient, setIsClient] = useState(false)
  const pet = pets.find((p) => p.id === petId)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const statusColors = {
    lost: 'bg-red-600 text-white',
    found: 'bg-green-600 text-white',
    shelter: 'bg-blue-600 text-white',
  }

  const statusLabels = {
    lost: 'PERDIDO',
    found: 'ENCONTRADO',
    shelter: 'EN REFUGIO',
  }

  if (!pet)
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">Reporte no disponible</h1>
        <button className="mt-4 text-primary" onClick={onBack}>
          Volver
        </button>
      </div>
    )
  return (
    <div className="min-h-screen bg-white pb-48">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-4 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            aria-label="Volver"
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-secondary rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <h1 className="text-xl font-semibold text-paws-dark">Caso #{pet.caseNumber}</h1>
        </div>
        <button
          aria-label="Compartir reporte"
          onClick={() => void shareReport(pet.id, pet.name)}
          className="p-2 hover:bg-secondary rounded-full"
        >
          <Share2 className="w-5 h-5 text-paws-dark" />
        </button>
      </div>

      {/* Pet Photo */}
      <div className="relative">
        <img src={pet.image} alt={pet.name} className="w-full h-72 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Pet Info */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-paws-dark">{pet.name}</h2>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[pet.status]}`}
          >
            {statusLabels[pet.status]}
          </span>
        </div>
        <p className="text-muted-foreground">{pet.breed}</p>

        {/* Info Row */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{pet.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pet.reportedAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            <span className="capitalize">
              {{ small: 'Pequeño', medium: 'Mediano', large: 'Grande' }[pet.size]}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="font-semibold text-paws-dark mb-2">Descripción</h3>
          <p className="text-muted-foreground">{pet.description}</p>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <h3 className="font-semibold text-paws-dark mb-4">Información del reporte</h3>
          <div className="space-y-4 bg-secondary rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-paws-dark">Reporte creado</p>
                <p className="text-xs text-muted-foreground">{pet.reportedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-paws-info">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-paws-dark">Reportado por: {pet.reportedBy}</p>
                <p className="text-xs text-muted-foreground">Ubicación: {pet.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-6">
          <h3 className="font-semibold text-paws-dark mb-3">Ubicación</h3>
          <div className="h-48 rounded-2xl overflow-hidden border border-border">
            {isClient && (
              <MapContainer
                center={[pet.lat, pet.lng]}
                zoom={14}
                className="h-full w-full"
                zoomControl={false}
                minZoom={2}
                maxZoom={19}
                maxBounds={[
                  [-85, -Infinity],
                  [85, Infinity],
                ]}
                maxBoundsViscosity={1}
              >
                <VectorMapLayer />
                <CircleMarker
                  center={[pet.lat, pet.lng]}
                  radius={10}
                  pathOptions={{
                    fillColor: pet.status === 'lost' ? '#EF4444' : '#22C55E',
                    color: '#FFFFFF',
                    weight: 3,
                    fillOpacity: 1,
                  }}
                />
              </MapContainer>
            )}
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${pet.lat},${pet.lng}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <MapPin className="h-4 w-4" />
            Cómo llegar con Google Maps
          </a>
        </div>

        {/* Reporter Info */}
        <div className="mt-6 p-4 bg-secondary rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {pet.reportedBy.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-paws-dark">{pet.reportedBy}</p>
              <p className="text-sm text-muted-foreground">
                Contacto: {pet.contactPhone || 'No disponible'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {pet.resolvedAt && (
        <p role="status" className="m-4 rounded-xl bg-primary/10 p-4 text-primary">
          Caso resuelto. Gracias por ayudar.
        </p>
      )}
      {pet.ownerId === user.id && (
        <div className="m-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => onNavigate('report', { editReportId: pet.id })}>
            Editar reporte
          </Button>
          {!pet.resolvedAt && (
            <Button
              onClick={async () => {
                try {
                  await resolvePet(pet.id)
                  toast.success('Caso marcado como resuelto')
                } catch {}
              }}
            >
              Marcar como resuelto
            </Button>
          )}
          <Button
            variant="outline"
            onClick={async () => {
              if (confirm('¿Eliminar este reporte y sus mensajes?'))
                try {
                  await deletePet(pet.id)
                  onNavigate('dashboard')
                } catch {}
            }}
          >
            Eliminar reporte
          </Button>
        </div>
      )}
      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 z-20 md:left-72 md:bottom-0 p-4 bg-white border-t border-border flex gap-3">
        <Button
          onClick={() =>
            pet.contactPhone
              ? window.location.assign(`tel:${pet.contactPhone.replace(/[^+\d]/g, '')}`)
              : onNavigate('chat', { petId: pet.id })
          }
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-paws-primary-dark text-white font-semibold"
        >
          <Phone className="w-5 h-5 mr-2" />
          Contactar al dueño
        </Button>
        <Button
          onClick={() => onNavigate('chat', { petId: pet.id })}
          variant="outline"
          className="flex-1 h-12 rounded-xl border-primary text-primary hover:bg-primary/10 font-semibold"
        >
          <Eye className="w-5 h-5 mr-2" />
          Reportar avistamiento
        </Button>
      </div>
    </div>
  )
}
