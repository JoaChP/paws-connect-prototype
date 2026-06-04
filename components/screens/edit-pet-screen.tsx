"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"
import { ImageUploader } from "@/components/image-uploader"

interface EditPetScreenProps {
  petId?: string
  onBack: () => void
}

export function EditPetScreen({ petId, onBack }: EditPetScreenProps) {
  const { registeredPets, addRegisteredPet, updateRegisteredPet, deleteRegisteredPet } = useApp()
  
  const existingPet = petId ? registeredPets.find(p => p.id === petId) : undefined
  const isEditing = !!existingPet

  const [name, setName] = useState(existingPet?.name || "")
  const [species, setSpecies] = useState<"dog" | "cat" | "other">(existingPet?.species || "dog")
  const [breed, setBreed] = useState(existingPet?.breed || "")
  const [age, setAge] = useState(existingPet?.age || "")
  const [microchip, setMicrochip] = useState(existingPet?.microchip || "")
  const [image, setImage] = useState(existingPet?.image || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (isEditing && petId) {
      updateRegisteredPet(petId, {
        name,
        species,
        breed,
        age,
        microchip: microchip || undefined,
        image,
      })
    } else {
      addRegisteredPet({
        name,
        species,
        breed,
        age,
        microchip: microchip || undefined,
        image,
      })
    }
    
    setIsSaving(false)
    onBack()
  }

  const handleDelete = () => {
    if (petId && confirm("¿Estás seguro de eliminar esta mascota?")) {
      deleteRegisteredPet(petId)
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-[#22C55E] px-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Mascota" : "Nueva Mascota"}
          </h1>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="bg-white text-[#22C55E] hover:bg-white/90"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Image Upload */}
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Foto de tu mascota
          </label>
          <ImageUploader
            value={image}
            onChange={setImage}
            aspectRatio="landscape"
            placeholder="Toca para subir foto"
          />
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Nombre *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de tu mascota"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Tipo de mascota
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "dog", label: "Perro" },
                { value: "cat", label: "Gato" },
                { value: "other", label: "Otro" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSpecies(option.value as typeof species)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    species === option.value
                      ? "bg-[#22C55E] text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Raza
            </label>
            <Input
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Ej: Golden Retriever"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Edad
            </label>
            <Input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej: 3 años"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Microchip (opcional)
            </label>
            <Input
              value={microchip}
              onChange={(e) => setMicrochip(e.target.value)}
              placeholder="Número de microchip"
              className="bg-muted/50"
            />
          </div>
        </div>

        {/* Delete Button */}
        {isEditing && (
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar mascota
          </Button>
        )}
      </div>
    </div>
  )
}
