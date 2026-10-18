'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, MapPin, Camera, PawPrint, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ScreenName } from '@/components/bottom-nav'
import { useApp } from '@/lib/app-context'
import {
  costaRicaLocations,
  findCanton,
  findDistrict,
  findProvince,
} from '@/lib/costa-rica-locations'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { prepareImage } from '@/lib/images'

const MapPicker = dynamic(() => import('@/components/map-picker'), { ssr: false })

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
})
const VectorMapLayer = dynamic(() => import('@/components/vector-map-layer'), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {
  ssr: false,
})

interface ReportScreenProps {
  onNavigate: (screen: ScreenName) => void
  onBack: () => void
  petId?: string
}

type ReportTab = 'perdida' | 'encontrada' | 'adopcion'

const colors = [
  { id: 'negro', label: 'Negro', color: '#1F2937' },
  { id: 'cafe', label: 'Café', color: '#92400E' },
  { id: 'blanco', label: 'Blanco', color: '#F9FAFB' },
  { id: 'gris', label: 'Gris', color: '#9CA3AF' },
  { id: 'naranja', label: 'Naranja', color: '#F97316' },
  { id: 'mixto', label: 'Mixto', color: 'linear-gradient(135deg, #92400E 50%, #F9FAFB 50%)' },
]

const sizes = [
  { id: 'pequeno', label: 'Pequeño' },
  { id: 'mediano', label: 'Mediano' },
  { id: 'grande', label: 'Grande' },
]

export function ReportScreen({ onNavigate, onBack, petId }: ReportScreenProps) {
  const {
    addPet,
    updatePet,
    pets,
    user,
    userLocation,
    isLocating,
    locationError,
    requestUserLocation,
  } = useApp()
  const existing = pets.find((p) => p.id === petId && p.ownerId === user.id)
  const [positionConfirmed, setPositionConfirmed] = useState(false)
  const [pending, setPending] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportTab>(
    existing?.status === 'found'
      ? 'encontrada'
      : existing?.status === 'shelter'
        ? 'adopcion'
        : 'perdida',
  )
  const [petName, setPetName] = useState(existing?.name || '')
  const [petType, setPetType] = useState<'perro' | 'gato' | 'otro'>(
    existing?.species === 'cat' ? 'gato' : existing?.species === 'other' ? 'otro' : 'perro',
  )
  const [breed, setBreed] = useState(existing?.breed || '')
  const [selectedColor, setSelectedColor] = useState<string>(existing?.color || '')
  const [selectedSize, setSelectedSize] = useState<string>(
    existing ? { small: 'pequeno', medium: 'mediano', large: 'grande' }[existing.size] : '',
  )
  const [description, setDescription] = useState(existing?.description || '')
  const [phone, setPhone] = useState(existing?.contactPhone || user.phone)
  const [image, setImage] = useState<string>(existing?.image || '')
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(
    existing ? [existing.lat, existing.lng] : [9.9281, -84.0907],
  )
  const [isClient, setIsClient] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCanton, setSelectedCanton] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const selectedProvinceOption = selectedProvince ? findProvince(selectedProvince) : null
  const selectedCantonOption =
    selectedProvince && selectedCanton ? findCanton(selectedProvince, selectedCanton) : null

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (userLocation && !existing) {
      setMarkerPosition([userLocation.lat, userLocation.lng])
    }
  }, [userLocation])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setImage(await prepareImage(file))
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Imagen no válida')
      }
    }
  }

  const handleSubmit = async () => {
    if (pending) return
    if (
      !petName.trim() ||
      !breed.trim() ||
      !selectedColor ||
      !selectedSize ||
      description.trim().length < 10 ||
      !/^[+\d\s()-]{8,30}$/.test(phone)
    ) {
      toast.error('Por favor completa los campos requeridos', {
        description:
          'Completa nombre, raza, color, tamaño, descripción (10 caracteres) y teléfono válido',
      })
      return
    }

    if (!existing && !positionConfirmed && !selectedProvince && !userLocation) {
      toast.error('Selecciona la ubicación en el mapa, una provincia o tu ubicación actual')
      return
    }
    setPending(true)
    try {
      const petImage = image || '/pet-placeholder.svg'

      // Create location string
      const locationString =
        [
          selectedProvinceOption?.label,
          selectedCantonOption?.label,
          findDistrict(selectedProvince, selectedCanton, selectedDistrict)?.label,
        ]
          .filter(Boolean)
          .join(', ') ||
        (existing && !positionConfirmed ? existing.location : '') ||
        `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`

      // The server checks ownership and creates the linked community post atomically.
      const speciesMap = { perro: 'dog', gato: 'cat', otro: 'other' } as const
      const sizeMap = { pequeno: 'small', mediano: 'medium', grande: 'large' } as const

      const reportData = {
        name: petName,
        species: speciesMap[petType],
        breed: breed,
        color: selectedColor || 'unknown',
        size: (sizeMap[selectedSize as keyof typeof sizeMap] || 'medium') as
          'small' | 'medium' | 'large',
        age: '?',
        gender: 'unknown' as const,
        status: (activeTab === 'perdida'
          ? 'lost'
          : activeTab === 'encontrada'
            ? 'found'
            : 'shelter') as 'lost' | 'found' | 'shelter',
        description: description,
        location: locationString,
        lat: markerPosition[0],
        lng: markerPosition[1],
        image: petImage,
        reportedBy: user.name,
        contactPhone: phone,
      }
      if (existing) await updatePet(existing.id, reportData)
      else await addPet(reportData)

      toast.success(
        existing
          ? 'Reporte actualizado'
          : activeTab === 'perdida'
            ? '¡Tu mascota perdida ha sido reportada!'
            : activeTab === 'adopcion'
              ? 'Reporte de adopción publicado'
              : '¡Mascota encontrada reportada!',
        {
          description: 'Tu reporte ya está guardado y disponible para la comunidad.',
          icon: <Check className="w-5 h-5" />,
        },
      )

      onNavigate('community')
    } catch {
      /* The context shows the server error; preserve the form. */
    } finally {
      setPending(false)
    }
  }

  const handleUseCurrentLocation = async () => {
    const location = await requestUserLocation()

    if (location) {
      setMarkerPosition([location.lat, location.lng])
      setPositionConfirmed(true)
      setSelectedProvince('')
      setSelectedCanton('')
      setSelectedDistrict('')
      toast.success('Ubicacion actual aplicada')
      return
    }

    toast.error(locationError || 'No pudimos obtener tu ubicacion')
  }

  const applyManualLocation = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    setPositionConfirmed(true)
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
          <button
            aria-label="Volver"
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-secondary rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <h1 className="text-xl font-semibold text-paws-dark">
            {existing ? 'Editar reporte' : 'Reportar mascota'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('perdida')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'perdida'
                ? 'bg-paws-urgent text-white'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            Mascota Perdida
          </button>
          <button
            onClick={() => setActiveTab('encontrada')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'encontrada'
                ? 'bg-primary text-white'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            Mascota Encontrada
          </button>
          <button
            onClick={() => setActiveTab('adopcion')}
            className={`flex-1 rounded-xl px-2 py-3 text-sm font-medium ${activeTab === 'adopcion' ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}
          >
            En adopción
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 md:p-8">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Foto de la mascota
          </label>
          <label className="block border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center bg-secondary/30 hover:border-primary/50 transition-colors cursor-pointer">
            {image ? (
              <div className="relative w-full">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg md:h-56"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setImage('')
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-paws-dark">Subir foto</p>
                <p className="text-sm text-muted-foreground mt-1">Toca para agregar una imagen</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Pet Name */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Nombre de la mascota
          </label>
          <Input
            aria-label="Nombre de la mascota"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Ej: Luna"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Pet Type */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">Tipo</label>
          <div className="flex gap-2">
            {(['perro', 'gato', 'otro'] as const).map((type) => (
              <button
                key={type}
                aria-pressed={petType === type}
                onClick={() => setPetType(type)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors capitalize ${
                  petType === type ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">Raza</label>
          <Input
            aria-label="Raza"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Ej: Golden Retriever"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                aria-pressed={selectedColor === c.id}
                onClick={() => setSelectedColor(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedColor === c.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
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
          <label className="block text-sm font-medium text-paws-dark mb-2">Tamaño</label>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <button
                key={s.id}
                aria-pressed={selectedSize === s.id}
                onClick={() => setSelectedSize(s.id)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  selectedSize === s.id
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Map */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">Última ubicación</label>
          <div className="mb-3 grid gap-2">
            <select
              aria-label="Provincia"
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
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="Cantón"
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
                aria-label="Distrito"
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
          </div>
          <p className="mb-2 text-xs text-muted-foreground">
            Toca el mapa para marcar el punto. Los selectores muestran ubicaciones aproximadas.
          </p>
          <div className="h-48 rounded-2xl overflow-hidden border border-border md:h-64">
            {isClient && (
              <MapContainer
                key={`${markerPosition[0]}-${markerPosition[1]}`}
                center={markerPosition}
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
                <CircleMarker center={markerPosition} radius={9} />
                <MapPicker onPick={applyManualLocation} />
              </MapContainer>
            )}
          </div>
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl text-sm font-medium text-primary hover:bg-secondary/80 transition-colors disabled:opacity-60"
          >
            <MapPin className="w-4 h-4" />
            {isLocating ? 'Obteniendo ubicacion...' : 'Usar mi ubicacion'}
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Descripción adicional
          </label>
          <textarea
            aria-label="Descripción adicional"
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Características especiales, collar, comportamiento..."
            rows={4}
            className="w-full p-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Teléfono de contacto (público)
          </label>
          <Input
            aria-label="Teléfono de contacto"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={30}
            placeholder="+506 8888-1234"
            type="tel"
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-border md:fixed md:bottom-0 md:left-72 md:right-0 md:px-8">
        <Button
          onClick={handleSubmit}
          disabled={pending}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-paws-primary-dark text-white font-semibold text-lg"
        >
          {pending ? 'Guardando…' : existing ? 'Guardar cambios' : 'Publicar reporte'}
        </Button>
      </div>
    </div>
  )
}
