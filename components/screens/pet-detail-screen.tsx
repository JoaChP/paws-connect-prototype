'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Share2, MapPin, Clock, Ruler, Phone, Eye, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)

interface PetDetailScreenProps {
  petId?: string
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}

export function PetDetailScreen({ petId, onNavigate, onBack }: PetDetailScreenProps) {
  const { pets } = useApp()
  const [isClient, setIsClient] = useState(false)
  const pet = pets.find((p) => p.id === petId) || pets[0]

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

  return (
    <div className="min-h-screen bg-white pb-48">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-4 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <h1 className="text-xl font-semibold text-paws-dark">Caso #{pet.caseNumber}</h1>
        </div>
        <button className="p-2 hover:bg-secondary rounded-full">
          <Share2 className="w-5 h-5 text-paws-dark" />
        </button>
      </div>

      {/* Pet Photo */}
      <div className="relative">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-72 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Pet Info */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-paws-dark">{pet.name}</h2>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[pet.status]}`}>
            {statusLabels[pet.status]}
          </span>
        </div>
        <p className="text-muted-foreground">{pet.breed}</p>

        {/* Info Row */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Alajuela</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pet.createdAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            <span className="capitalize">{pet.size === 'pequeno' ? 'Pequeño' : pet.size}</span>
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
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
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
        </div>

        {/* Reporter Info */}
        <div className="mt-6 p-4 bg-secondary rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {pet.reportedBy.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-paws-dark">{pet.reportedBy}</p>
              <p className="text-sm text-muted-foreground">Contacto: {pet.contactPhone || 'No disponible'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 z-20 p-4 bg-white border-t border-border flex gap-3">
        <Button
          onClick={() => onNavigate('chat')}
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-paws-primary-dark text-white font-semibold"
        >
          <Phone className="w-5 h-5 mr-2" />
          Contactar al dueño
        </Button>
        <Button
          onClick={() => onNavigate('report')}
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
