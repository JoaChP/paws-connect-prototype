'use client'

import { Search, Bell, MapPin } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { user, pets } = useApp()
  
  const nearbyPets = pets.filter(p => p.status === 'lost' || p.status === 'found').slice(0, 6)
  const recentAlerts = pets.slice(0, 3)

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm md:px-8 md:pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <p className="text-sm text-muted-foreground">Buenos días</p>
              <h2 className="font-semibold text-paws-dark">{user.name.split(' ')[0]}</h2>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Bell className="w-6 h-6 text-paws-dark" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-paws-urgent rounded-full border-2 border-white" />
          </button>
        </div>

        {/* Search Bar */}
        <button 
          onClick={() => onNavigate('search')}
          className="w-full flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl text-muted-foreground"
        >
          <Search className="w-5 h-5" />
          <span>Buscar mascota perdida...</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-4 md:px-8">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <StatCard 
            icon={<div className="w-8 h-8 rounded-full bg-paws-active/20 flex items-center justify-center"><span className="text-paws-active font-bold">{pets.filter(p => p.status === 'lost').length}</span></div>}
            label="Perdidas"
            color="blue"
          />
          <StatCard 
            icon={<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-primary font-bold">{pets.filter(p => p.status === 'found').length}</span></div>}
            label="Encontradas"
            color="green"
          />
          <StatCard 
            icon={<div className="w-8 h-8 rounded-full bg-paws-alert/20 flex items-center justify-center"><span className="text-paws-alert font-bold">{user.reportsCount}</span></div>}
            label="Reportes"
            color="amber"
          />
        </div>
      </div>

      {/* Recent Alerts Section */}
      <section className="px-4 mb-6 md:px-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-paws-dark">Alertas recientes</h3>
          <button className="text-sm text-primary font-medium">Ver todas</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:grid md:grid-cols-2 md:overflow-visible md:mx-0 md:px-0 lg:grid-cols-3">
          {recentAlerts.map((pet) => (
            <AlertCard 
              key={pet.id} 
              pet={pet} 
              onClick={() => onNavigate('petDetail', { petId: pet.id })}
            />
          ))}
        </div>
      </section>

      {/* Nearby Pets Section */}
      <section className="px-4 md:px-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-paws-dark">Mascotas cercanas</h3>
          <button 
            onClick={() => onNavigate('map')}
            className="text-sm text-primary font-medium"
          >
            Ver mapa
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 stagger-children md:grid-cols-3 lg:grid-cols-4">
          {nearbyPets.map((pet) => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              onClick={() => onNavigate('petDetail', { petId: pet.id })}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-border flex flex-col items-center gap-2 md:p-4">
      {icon}
      <span className="text-xs text-center text-muted-foreground">{label}</span>
    </div>
  )
}

function AlertCard({ pet, onClick }: { pet: any; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex-shrink-0 w-72 bg-white rounded-2xl p-3 shadow-sm border border-border flex items-center gap-3 hover:border-primary transition-colors md:w-full"
    >
      <img
        src={pet.image}
        alt={pet.name}
        className="w-14 h-14 rounded-xl object-cover"
      />
      <div className="flex-1 text-left">
        <p className="font-medium text-paws-dark">{pet.name}</p>
        <p className="text-sm text-muted-foreground">{pet.breed}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{pet.location}</span>
          <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-full ml-1 font-medium">
            {pet.status === 'lost' ? 'Perdido' : 'Encontrado'}
          </span>
        </div>
      </div>
    </button>
  )
}

function PetCard({ pet, onClick }: { pet: any; onClick: () => void }) {
  const statusColors = {
    lost: 'bg-paws-urgent text-white',
    found: 'bg-primary text-white',
    shelter: 'bg-paws-info text-white',
  }

  const statusLabels = {
    lost: 'Perdido',
    found: 'Encontrado',
    shelter: 'Refugio',
  }

  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:border-primary transition-colors text-left"
    >
      <div className="relative">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-32 object-cover md:h-40"
        />
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[pet.status] || 'bg-gray-400 text-white'}`}>
          {statusLabels[pet.status] || 'Info'}
        </span>
      </div>
      <div className="p-3">
        <p className="font-medium text-paws-dark">{pet.name}</p>
        <p className="text-sm text-muted-foreground">{pet.breed}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{pet.location}</span>
        </div>
      </div>
    </button>
  )
}
