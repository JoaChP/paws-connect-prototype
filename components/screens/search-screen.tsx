'use client'

import { useState } from 'react'
import { ArrowLeft, Search, X, PawPrint, Dog, Cat, LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ScreenName } from '@/components/bottom-nav'
import { useApp } from '@/lib/app-context'
import { costaRicaLocations, findCanton, findDistrict, findProvince } from '@/lib/costa-rica-locations'

interface SearchScreenProps {
  onNavigate: (screen: ScreenName) => void
  onBack: () => void
}

type ReportType = 'perdido' | 'encontrado' | 'adopcion'
type AnimalType = 'perro' | 'gato' | 'otro'
type SizeType = 'pequeno' | 'mediano' | 'grande'

const colors = [
  { id: 'negro', label: 'Negro', color: '#1F2937' },
  { id: 'cafe', label: 'Cafe', color: '#92400E' },
  { id: 'blanco', label: 'Blanco', color: '#F9FAFB' },
  { id: 'gris', label: 'Gris', color: '#9CA3AF' },
  { id: 'naranja', label: 'Naranja', color: '#F97316' },
  { id: 'mixto', label: 'Mixto', color: 'linear-gradient(135deg, #92400E 50%, #F9FAFB 50%)' },
]

export function SearchScreen({ onNavigate, onBack }: SearchScreenProps) {
  const {
    setSearchQuery: setGlobalSearchQuery,
    setStatusFilter,
    setSpeciesFilter,
    setColorFilter,
    setSizeFilter,
    setRadiusFilter,
    userLocation,
    setUserLocation,
    isLocating,
    locationError,
    requestUserLocation,
  } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)
  const [selectedAnimalType, setSelectedAnimalType] = useState<AnimalType | null>(null)
  const [radius, setRadius] = useState(5)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCanton, setSelectedCanton] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const selectedProvinceOption = selectedProvince ? findProvince(selectedProvince) : null
  const selectedCantonOption = selectedProvince && selectedCanton ? findCanton(selectedProvince, selectedCanton) : null

  const handleApply = () => {
    const reportTypeMap = {
      perdido: 'lost',
      encontrado: 'found',
      adopcion: 'shelter',
    } as const

    const animalTypeMap = {
      perro: 'dog',
      gato: 'cat',
      otro: 'other',
    } as const

    const sizeMap = {
      pequeno: 'small',
      mediano: 'medium',
      grande: 'large',
    } as const

    setGlobalSearchQuery(searchQuery.trim())
    setStatusFilter(selectedReportType ? reportTypeMap[selectedReportType] : 'all')
    setSpeciesFilter(selectedAnimalType ? animalTypeMap[selectedAnimalType] : 'all')
    setColorFilter(selectedColor || 'all')
    setSizeFilter(selectedSize ? sizeMap[selectedSize] : 'all')
    setRadiusFilter(radius)
    onNavigate('map')
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedReportType(null)
    setSelectedAnimalType(null)
    setRadius(5)
    setSelectedColor(null)
    setSelectedSize(null)
    setGlobalSearchQuery('')
    setStatusFilter('all')
    setSpeciesFilter('all')
    setColorFilter('all')
    setSizeFilter('all')
    setRadiusFilter(50)
  }

  const handleUseLocation = async () => {
    await requestUserLocation()
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

  return (
    <div className="relative min-h-screen bg-white pb-24 md:pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border md:px-8 md:pt-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar mascota..."
              className="w-full pl-10 pr-10 py-3 bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 md:p-8">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-3">
            Tipo de reporte
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedReportType(selectedReportType === 'perdido' ? null : 'perdido')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                selectedReportType === 'perdido'
                  ? 'bg-paws-urgent text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${selectedReportType === 'perdido' ? 'bg-white' : 'bg-paws-urgent'}`} />
              Perdido
            </button>
            <button
              onClick={() => setSelectedReportType(selectedReportType === 'encontrado' ? null : 'encontrado')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                selectedReportType === 'encontrado'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${selectedReportType === 'encontrado' ? 'bg-white' : 'bg-primary'}`} />
              Encontrado
            </button>
            <button
              onClick={() => setSelectedReportType(selectedReportType === 'adopcion' ? null : 'adopcion')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                selectedReportType === 'adopcion'
                  ? 'bg-paws-info text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <PawPrint className={`w-4 h-4 ${selectedReportType === 'adopcion' ? 'text-white' : 'text-paws-info'}`} />
              Adopcion
            </button>
          </div>
        </div>

        {/* Animal Type */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-3">
            Tipo de animal
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedAnimalType(selectedAnimalType === 'perro' ? null : 'perro')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                selectedAnimalType === 'perro'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Dog className="w-5 h-5" />
              Perro
            </button>
            <button
              onClick={() => setSelectedAnimalType(selectedAnimalType === 'gato' ? null : 'gato')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                selectedAnimalType === 'gato'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Cat className="w-5 h-5" />
              Gato
            </button>
            <button
              onClick={() => setSelectedAnimalType(selectedAnimalType === 'otro' ? null : 'otro')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                selectedAnimalType === 'otro'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <PawPrint className="w-5 h-5" />
              Otro
            </button>
          </div>
        </div>

        {/* Radius */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-paws-dark">
              Radio de busqueda
            </label>
            <button
              onClick={handleUseLocation}
              disabled={isLocating}
              className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-60"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Ubicando' : userLocation ? 'Ubicacion activa' : 'Mi ubicacion'}
            </button>
          </div>
          {locationError && (
            <p className="mb-2 text-xs text-paws-urgent">{locationError}</p>
          )}
          <div className="mb-3 grid gap-2 md:grid-cols-3">
            <select
              value={selectedProvince}
              onChange={(event) => handleProvinceChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-paws-dark outline-none focus:ring-2 focus:ring-primary/20"
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
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-paws-dark outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-paws-dark outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            >
              <option value="">Distrito</option>
              {selectedCantonOption?.districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.label}
                </option>
              ))}
            </select>
          </div>
          <div className="px-2">
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>1 km</span>
              <span className="font-semibold text-primary">{radius} km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(selectedColor === c.id ? null : c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedColor === c.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ 
                    background: c.color.includes('gradient') ? c.color : c.color,
                  }}
                />
                <span className="text-sm">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-3">
            Tamano
          </label>
          <div className="flex gap-2">
            {(['pequeno', 'mediano', 'grande'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors capitalize ${
                  selectedSize === size
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {size === 'pequeno' ? 'Pequeno' : size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-border flex gap-3 md:absolute md:bottom-0 md:left-0 md:right-0 md:px-8">
        <Button
          onClick={handleApply}
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-paws-primary-dark text-white font-semibold"
        >
          Aplicar filtros
        </Button>
        <button
          onClick={handleClear}
          className="px-4 h-12 rounded-xl text-muted-foreground hover:text-paws-dark font-medium"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
