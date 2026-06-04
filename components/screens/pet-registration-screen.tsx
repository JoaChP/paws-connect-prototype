'use client'

import { useState } from 'react'
import { ArrowLeft, Camera, PawPrint, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ScreenName } from '@/components/bottom-nav'

interface PetRegistrationScreenProps {
  onNavigate: (screen: ScreenName) => void
  onBack: () => void
}

const colors = [
  { id: 'negro', label: 'Negro', color: '#1F2937' },
  { id: 'cafe', label: 'Cafe', color: '#92400E' },
  { id: 'blanco', label: 'Blanco', color: '#F9FAFB' },
  { id: 'gris', label: 'Gris', color: '#9CA3AF' },
  { id: 'naranja', label: 'Naranja', color: '#F97316' },
  { id: 'mixto', label: 'Mixto', color: 'linear-gradient(135deg, #92400E 50%, #F9FAFB 50%)' },
]

const sizes = [
  { id: 'pequeno', label: 'Pequeno' },
  { id: 'mediano', label: 'Mediano' },
  { id: 'grande', label: 'Grande' },
]

export function PetRegistrationScreen({ onNavigate, onBack }: PetRegistrationScreenProps) {
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState<'perro' | 'gato' | 'otro'>('perro')
  const [breed, setBreed] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [features, setFeatures] = useState('')
  const [generateQR, setGenerateQR] = useState(false)

  const handleSubmit = () => {
    alert('Mascota registrada exitosamente!')
    onNavigate('profile')
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <h1 className="text-xl font-semibold text-paws-dark">Registrar Mascota</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6">
        {/* Photo Upload */}
        <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center bg-secondary/30 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <p className="font-medium text-paws-dark">Subir foto</p>
          <p className="text-sm text-muted-foreground mt-1">Toca para agregar una imagen</p>
        </div>

        {/* Pet Name */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Nombre
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
          <label className="block text-sm font-medium text-paws-dark mb-2">Tamano</label>
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

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-paws-dark mb-2">
            Caracteristicas especiales
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Manchas, cicatrices, collar, chip..."
            rows={3}
            className="w-full p-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
          />
        </div>

        {/* Generate QR */}
        <div className="p-4 bg-secondary rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-paws-dark">Generar perfil QR</p>
                <p className="text-xs text-muted-foreground">Codigo para el collar</p>
              </div>
            </div>
            <button
              onClick={() => setGenerateQR(!generateQR)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                generateQR ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  generateQR ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {generateQR && (
            <div className="p-4 bg-white rounded-xl text-center">
              <div className="w-32 h-32 mx-auto bg-paws-dark rounded-lg flex items-center justify-center mb-3">
                <QrCode className="w-20 h-20 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                pawsconnect.com/pet/abc123
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-border">
        <Button
          onClick={handleSubmit}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-paws-primary-dark text-white font-semibold text-lg"
        >
          <PawPrint className="w-5 h-5 mr-2" />
          Guardar Mascota
        </Button>
      </div>
    </div>
  )
}
