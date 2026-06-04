'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Heart, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockShelters } from '@/lib/mock-data'
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

interface SheltersScreenProps {
  onNavigate: (screen: ScreenName) => void
  onBack: () => void
}

export function SheltersScreen({ onNavigate, onBack }: SheltersScreenProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <h1 className="text-xl font-semibold text-paws-dark">Refugios Aliados</h1>
        </div>
      </div>

      {/* Map */}
      <div className="h-48 mx-4 mt-4 rounded-2xl overflow-hidden border border-border">
        {isClient && (
          <MapContainer
            center={[9.9281, -84.0907]}
            zoom={10}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mockShelters.map((shelter) => (
              <CircleMarker
                key={shelter.id}
                center={[shelter.coordinates.lat, shelter.coordinates.lng]}
                radius={10}
                pathOptions={{
                  fillColor: '#3B82F6',
                  color: '#FFFFFF',
                  weight: 3,
                  fillOpacity: 1,
                }}
              />
            ))}
          </MapContainer>
        )}
      </div>

      {/* Shelter List */}
      <div className="p-4 space-y-4 stagger-children">
        {mockShelters.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-start gap-4">
              <img
                src={shelter.logo}
                alt={shelter.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-paws-dark">{shelter.name}</h3>
                  {shelter.verified && (
                    <div className="w-5 h-5 bg-paws-info rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{shelter.location}</span>
                </div>
                <p className="text-sm text-primary font-medium mt-1">
                  {shelter.pets} mascotas disponibles
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1 h-10 rounded-xl bg-primary hover:bg-paws-primary-dark text-white font-medium text-sm"
              >
                <Heart className="w-4 h-4 mr-2" />
                Adoptar
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-10 rounded-xl border-primary text-primary hover:bg-primary/10 font-medium text-sm"
              >
                Donar
              </Button>
              <Button
                variant="outline"
                className="h-10 px-4 rounded-xl border-border text-muted-foreground hover:bg-secondary font-medium text-sm"
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-4 bg-primary/10 rounded-2xl">
        <h4 className="font-medium text-paws-dark mb-1">Quieres ser refugio aliado?</h4>
        <p className="text-sm text-muted-foreground">
          Contactanos para unirte a nuestra red y ayudar a mas mascotas a encontrar un hogar.
        </p>
        <button className="mt-3 text-sm font-semibold text-primary">
          Mas informacion
        </button>
      </div>
    </div>
  )
}
