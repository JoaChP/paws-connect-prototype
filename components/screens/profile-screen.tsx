'use client'

import { Settings, PawPrint, FileText, Star, ChevronRight, Shield } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, registeredPets } = useApp()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-[#22C55E] px-4 pt-12 pb-20 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <PawPrint className="w-24 h-24 text-white rotate-[-15deg]" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <PawPrint className="w-32 h-32 text-white rotate-[20deg]" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <h1 className="text-xl font-semibold text-white">Mi Perfil</h1>
          <button 
            onClick={() => onNavigate('editProfile')}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 mt-6 relative z-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="text-white">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-white/80">{user.location}</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mx-4 -mt-10 bg-white rounded-2xl shadow-lg p-4 relative z-20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <PawPrint className="w-5 h-5" />
              <span className="text-2xl font-bold">{user.petsCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Mascotas</p>
          </div>
          <div className="border-x border-border">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <FileText className="w-5 h-5" />
              <span className="text-2xl font-bold">{user.reportsCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Reportes</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Star className="w-5 h-5" />
              <span className="text-2xl font-bold">{user.points}</span>
            </div>
            <p className="text-xs text-muted-foreground">Puntos</p>
          </div>
        </div>

        {/* Badge */}
        <div className="mt-4 p-3 bg-primary/10 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-primary">{user.badge}</p>
            <p className="text-xs text-muted-foreground">Nivel de participacion</p>
          </div>
        </div>
      </div>

      {/* My Pets Section */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-paws-dark">Mis Mascotas ({registeredPets.length})</h3>
          <button 
            onClick={() => onNavigate('petRegistration')}
            className="text-sm text-primary font-medium"
          >
            Agregar
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {registeredPets.slice(0, 3).map((pet) => (
            <button
              key={pet.id}
              onClick={() => onNavigate('editPet', { petId: pet.id })}
              className="flex-shrink-0 w-32 bg-white rounded-2xl overflow-hidden shadow-sm border border-border"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-2 text-center">
                <p className="font-medium text-paws-dark text-sm">{pet.name}</p>
                <p className="text-xs text-muted-foreground">{pet.breed}</p>
              </div>
            </button>
          ))}
          <button 
            onClick={() => onNavigate('petRegistration')}
            className="flex-shrink-0 w-32 h-[136px] bg-secondary rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-2">
              <PawPrint className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary">Agregar</p>
          </button>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="px-4 mt-6">
        <h3 className="font-semibold text-paws-dark mb-3">Información</h3>
        <div className="bg-white rounded-2xl divide-y divide-border overflow-hidden shadow-sm border border-border">
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-paws-dark">{user.email}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium text-paws-dark">{user.phone}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Bio</p>
            <p className="font-medium text-paws-dark">{user.bio}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-6">
        <h3 className="font-semibold text-paws-dark mb-3">Acciones rapidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate('notifications')}
            className="bg-white rounded-xl p-4 shadow-sm border border-border text-left hover:border-primary transition-colors"
          >
            <p className="font-medium text-paws-dark">Notificaciones</p>
            <p className="text-xs text-muted-foreground mt-1">Ver alertas recientes</p>
          </button>
          <button 
            onClick={() => onNavigate('shelters')}
            className="bg-white rounded-xl p-4 shadow-sm border border-border text-left hover:border-primary transition-colors"
          >
            <p className="font-medium text-paws-dark">Refugios</p>
            <p className="text-xs text-muted-foreground mt-1">Explorar refugios aliados</p>
          </button>
        </div>
      </section>
    </div>
  )
}
