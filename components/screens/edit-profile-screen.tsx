"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"
import { ImageUploader } from "@/components/image-uploader"

interface EditProfileScreenProps {
  onBack: () => void
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { user, updateUser } = useApp()
  
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [location, setLocation] = useState(user.location)
  const [bio, setBio] = useState(user.bio)
  const [avatar, setAvatar] = useState(user.avatar)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    updateUser({
      name,
      email,
      phone,
      location,
      bio,
      avatar,
    })
    
    setIsSaving(false)
    onBack()
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
          <h1 className="text-lg font-semibold text-white">Editar Perfil</h1>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
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

      <div className="px-4 -mt-12">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center cursor-pointer shadow-lg">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setAvatar(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Nombre completo
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Correo electrónico
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Teléfono
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+506 8888-1234"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Ubicación
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ciudad, País"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Biografía
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
