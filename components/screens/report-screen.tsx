'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, MapPin, Camera, PawPrint, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ScreenName } from '@/components/bottom-nav'
import { useApp } from '@/lib/app-context'
import { costaRicaLocations, findCanton, findDistrict, findProvince } from '@/lib/costa-rica-locations'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

interface ReportScreenProps {
  onNavigate: (screen: ScreenName) => void
  onBack: () => void
}

type ReportTab = 'perdida' | 'encontrada'

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

export function ReportScreen({ onNavigate, onBack }: ReportScreenProps) {
  const { addPost, addPet, user, userLocation, isLocating, locationError, requestUserLocation } = useApp()
  const [activeTab, setActiveTab] = useState<ReportTab>('perdida')
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState<'perro' | 'gato' | 'otro'>('perro')
  const [breed, setBreed] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState<string>('')
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([9.9281, -84.0907])
  const [isClient, setIsClient] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCanton, setSelectedCanton] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const selectedProvinceOption = selectedProvince ? findProvince(selectedProvince) : null
  const selectedCantonOption = selectedProvince && selectedCanton ? findCanton(selectedProvince, selectedCanton) : null

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (userLocation) {
      setMarkerPosition([userLocation.lat, userLocation.lng])
    }
  }, [userLocation])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!petName || !breed) {
      toast.error('Por favor completa los campos requeridos', {
        description: 'Necesitamos el nombre y raza de la mascota',
      })
      return
    }

    // Use uploaded image or placeholder
    const petImage = image || (petType === 'perro' 
      ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
      : petType === 'gato'
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
      : 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400&h=400&fit=crop')

    // Create location string
    const locationString = `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`

    // Add pet report to context
    const speciesMap = { perro: 'dog', gato: 'cat', otro: 'other' } as const
    const sizeMap = { pequeno: 'small', mediano: 'medium', grande: 'large' } as const
    
    const newPet = addPet({
      name: petName,
      species: speciesMap[petType],
      breed: breed,
      color: selectedColor || 'unknown',
      size: (sizeMap[selectedSize as keyof typeof sizeMap] || 'medium') as 'small' | 'medium' | 'large',
      age: '?',
      gender: 'unknown',
      status: activeTab === 'perdida' ? 'lost' : 'found',
      description: description,
      location: locationString,
      lat: markerPosition[0],
      lng: markerPosition[1],
      image: petImage,
      reportedBy: user.name,
      contactPhone: phone,
    })

    // Add post to community
    addPost({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      petId: newPet.id,
      petName: petName,
      petImage: petImage,
      type: activeTab === 'perdida' ? 'lost' : 'found',
      content: `${activeTab === 'perdida' ? 'Mascota PERDIDA' : 'Mascota ENCONTRADA'}: ${petName} (${breed})\n\n${description}\n\nContacto: ${phone}`,
      location: locationString,
    })

    toast.success(
      activeTab === 'perdida' 
        ? '¡Tu mascota perdida ha sido reportada!' 
        : '¡Mascota encontrada reportada!',
      {
        description: 'La comunidad de PawsConnect está siendo notificada. Pronto recibirás ayuda.',
        icon: <Check className="w-5 h-5" />,
      }
    )
    
    setTimeout(() => onNavigate('community'), 1500)
  }

  const handleUseCurrentLocation = async () => {
    const location = await requestUserLocation()

    if (location) {
      setMarkerPosition([location.lat, location.lng])
      toast.success('Ubicacion actual aplicada')
      return
    }

    toast.error(locationError || 'No pudimos obtener tu ubicacion')
  }

  const applyManualLocation = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
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
          <h1 className="text-xl font-semibold text-paws-dark">Reportar Mascota</h1>
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
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 md:p-8">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">Foto de la mascota</label>
          <label className="block border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center bg-secondary/30 hover:border-primary/50 transition-colors cursor-pointer">
            {image ? (
              <div className="relative w-full">
                <img src={image} alt="Preview" className="w-full h-40 object-cover rounded-lg md:h-56" />
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Pet Name */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Nombre de la mascota
          </label>
          <Input
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
                onClick={() => setPetType(type)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors capitalize ${
                  petType === type
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground'
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
                onClick={() => setSelectedColor(c.id)}
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
          <label className="block text-sm font-medium text-paws-dark mb-2">Tamaño</label>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <button
                key={s.id}
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
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Última ubicación
          </label>
          <div className="mb-3 grid gap-2">
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
            <div className="grid grid-cols-2 gap-2">
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
          </div>
          <div className="h-48 rounded-2xl overflow-hidden border border-border md:h-64">
            {isClient && (
              <MapContainer
                key={`${markerPosition[0]}-${markerPosition[1]}`}
                center={markerPosition}
                zoom={14}
                className="h-full w-full"
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerPosition} />
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
            Datos de contacto
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+506 8888-1234"
            type="tel"
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-border md:absolute md:bottom-0 md:left-0 md:right-0 md:px-8">
        <Button
          onClick={handleSubmit}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-paws-primary-dark text-white font-semibold text-lg"
        >
          Publicar Reporte
        </Button>
      </div>
    </div>
  )
}
