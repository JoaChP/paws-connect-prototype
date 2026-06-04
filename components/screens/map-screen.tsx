'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronUp, MapPin, Clock, LocateFixed } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'
import { costaRicaLocations, findCanton, findDistrict, findProvince } from '@/lib/costa-rica-locations'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
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
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapScreenProps {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
}

type FilterType = 'todos' | 'perdidos' | 'encontrados' | 'refugios'

export function MapScreen({ onNavigate }: MapScreenProps) {
  const {
    filteredPets,
    statusFilter,
    setStatusFilter,
    userLocation,
    setUserLocation,
    isLocating,
    requestUserLocation,
  } = useApp()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCanton, setSelectedCanton] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  useEffect(() => {
    setIsClient(true)
    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css')
  }, [])

  const filters: { id: FilterType; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'perdidos', label: 'Perdidos' },
    { id: 'encontrados', label: 'Encontrados' },
    { id: 'refugios', label: 'Refugios' },
  ]

  const nearbySightings = filteredPets.slice(0, 4)
  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [9.9281, -84.0907]
  const selectedProvinceOption = selectedProvince ? findProvince(selectedProvince) : null
  const selectedCantonOption = selectedProvince && selectedCanton ? findCanton(selectedProvince, selectedCanton) : null

  const activeFilter: FilterType =
    statusFilter === 'lost'
      ? 'perdidos'
      : statusFilter === 'found'
        ? 'encontrados'
        : statusFilter === 'shelter'
          ? 'refugios'
          : 'todos'

  const handleFilterChange = (filterId: FilterType) => {
    const statusMap = {
      todos: 'all',
      perdidos: 'lost',
      encontrados: 'found',
      refugios: 'shelter',
    } as const

    setStatusFilter(statusMap[filterId])
  }

  const applyManualLocation = (lat: number, lng: number) => {
    setUserLocation({ lat, lng, accuracy: 25000 })
  }

  const handleProvinceChange = (provinceId: string) => {
    const province = findProvince(provinceId)

    setSelectedProvince(provinceId)
    setSelectedCanton('')
    setSelectedDistrict('')
    if (province) applyManualLocation(province.lat, province.lng)
  }

  const handleCantonChange = (cantonId: string) => {
    const canton = findCanton(selectedProvince, cantonId)

    setSelectedCanton(cantonId)
    setSelectedDistrict('')
    if (canton) applyManualLocation(canton.lat, canton.lng)
  }

  const handleDistrictChange = (districtId: string) => {
    const district = findDistrict(selectedProvince, selectedCanton, districtId)

    setSelectedDistrict(districtId)
    if (district) applyManualLocation(district.lat, district.lng)
  }

  const statusStyles = {
    lost: {
      card: 'bg-red-50 hover:bg-red-100/80 border border-red-100',
      badge: 'bg-paws-urgent/15 text-paws-urgent',
      label: 'Perdido',
    },
    found: {
      card: 'bg-secondary hover:bg-secondary/80 border border-green-100',
      badge: 'bg-primary/20 text-primary',
      label: 'Encontrado',
    },
    shelter: {
      card: 'bg-blue-50 hover:bg-blue-100/80 border border-blue-100',
      badge: 'bg-paws-active/15 text-paws-active',
      label: 'Refugio',
    },
  }

  return (
    <div className="min-h-screen bg-background relative md:h-screen md:min-h-0">
      {/* Map Container */}
      <div className="h-screen w-full md:h-full">
        {isClient && (
          <MapContainer
            key={`${mapCenter[0]}-${mapCenter[1]}`}
            center={mapCenter}
            zoom={13}
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                radius={9}
                pathOptions={{
                  fillColor: '#2563EB',
                  color: '#FFFFFF',
                  weight: 3,
                  fillOpacity: 1,
                }}
              />
            )}
            
            {/* Pet Markers */}
            {filteredPets.map((pet) => (
              <CircleMarker
                key={pet.id}
                center={[pet.lat, pet.lng]}
                radius={12}
                pathOptions={{
                  fillColor: pet.status === 'lost' ? '#EF4444' : '#22C55E',
                  color: '#FFFFFF',
                  weight: 3,
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <h4 className="font-semibold text-paws-dark">{pet.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{pet.breed}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Clock className="w-3 h-3" />
                      <span>Vista {pet.lastSeen}</span>
                      <span className="mx-1">·</span>
                      <span>{pet.distance}</span>
                    </div>
                    <button 
                      onClick={() => onNavigate('petDetail', { petId: pet.id })}
                      className="w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-paws-primary-dark transition-colors"
                    >
                      Ver caso
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Search Bar Overlay */}
      <div className="absolute top-12 left-4 right-4 z-10 md:left-6 md:right-auto md:top-6 md:w-[420px]">
        <button 
          onClick={() => onNavigate('search')}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg text-muted-foreground"
        >
          <Search className="w-5 h-5" />
          <span>Buscar en el mapa...</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="absolute top-28 left-0 right-0 z-10 px-4 md:left-6 md:right-auto md:top-24 md:w-[420px] md:px-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:overflow-visible">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-paws-dark shadow-sm'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={requestUserLocation}
        className="absolute top-[10.5rem] right-4 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-paws-dark shadow-lg hover:bg-secondary transition-colors md:top-6 md:right-6"
      >
        <LocateFixed className={`w-4 h-4 text-primary ${isLocating ? 'animate-spin' : ''}`} />
        {isLocating ? 'Ubicando' : 'Mi ubicacion'}
      </button>

      <div className="absolute top-[13.5rem] left-4 right-4 z-10 grid grid-cols-3 gap-2 md:left-6 md:right-auto md:top-40 md:w-[420px]">
        <select
          value={selectedProvince}
          onChange={(event) => handleProvinceChange(event.target.value)}
          className="h-10 rounded-full bg-white px-2 text-xs font-medium text-paws-dark shadow-lg outline-none"
        >
          <option value="">Provincia</option>
          {costaRicaLocations.map((province) => (
            <option key={province.id} value={province.id}>
              {province.label}
            </option>
          ))}
        </select>
        <select
          value={selectedCanton}
          onChange={(event) => handleCantonChange(event.target.value)}
          disabled={!selectedProvinceOption}
          className="h-10 rounded-full bg-white px-2 text-xs font-medium text-paws-dark shadow-lg outline-none disabled:opacity-60"
        >
          <option value="">Canton</option>
          {selectedProvinceOption?.cantons.map((canton) => (
            <option key={canton.id} value={canton.id}>
              {canton.label}
            </option>
          ))}
        </select>
        <select
          value={selectedDistrict}
          onChange={(event) => handleDistrictChange(event.target.value)}
          disabled={!selectedCantonOption}
          className="h-10 rounded-full bg-white px-2 text-xs font-medium text-paws-dark shadow-lg outline-none disabled:opacity-60"
        >
          <option value="">Distrito</option>
          {selectedCantonOption?.districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.label}
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="absolute bottom-40 right-4 z-10 bg-white rounded-xl shadow-lg p-3 space-y-2 md:bottom-6 md:left-6 md:right-auto">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-paws-urgent" />
          <span className="text-muted-foreground">Perdido</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Encontrado</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-paws-active" />
          <span className="text-muted-foreground">Refugio</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div 
        className={`absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-10 transition-transform duration-300 md:bottom-6 md:left-auto md:right-6 md:w-[390px] md:rounded-2xl ${
          isBottomSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
        }`}
      >
        {/* Handle */}
        <button 
          onClick={() => setIsBottomSheetOpen(!isBottomSheetOpen)}
          className="w-full py-3 flex justify-center"
        >
          <div className="w-10 h-1 bg-border rounded-full" />
        </button>

        <div className="px-4 pb-6 max-h-[300px] overflow-y-auto md:max-h-[calc(100vh-180px)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-paws-dark">Avistamientos cercanos</h3>
            <button onClick={() => setIsBottomSheetOpen(!isBottomSheetOpen)}>
              <ChevronUp className={`w-5 h-5 text-muted-foreground transition-transform ${isBottomSheetOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>

          <div className="space-y-3">
            {nearbySightings.map((pet) => (
              <button
                key={pet.id}
                onClick={() => onNavigate('petDetail', { petId: pet.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${statusStyles[pet.status].card}`}
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-paws-dark">{pet.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{pet.lastSeen}</span>
                    <span className="mx-1">·</span>
                    <MapPin className="w-3 h-3" />
                    <span>{pet.distance}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[pet.status].badge}`}>
                  {statusStyles[pet.status].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
