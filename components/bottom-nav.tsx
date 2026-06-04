'use client'

import { Home, Map, Plus, Users, User, PawPrint } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ScreenName = 
  | 'login' 
  | 'onboarding' 
  | 'dashboard' 
  | 'map' 
  | 'report' 
  | 'community' 
  | 'profile'
  | 'petDetail'
  | 'aiMatch'
  | 'aiMatchList'
  | 'chat'
  | 'notifications'
  | 'shelters'
  | 'petRegistration'
  | 'search'
  | 'editProfile'
  | 'editPet'

interface BottomNavProps {
  activeTab: ScreenName
  onNavigate: (screen: ScreenName) => void
}

const navItems = [
  { id: 'dashboard' as ScreenName, icon: Home, label: 'Inicio' },
  { id: 'map' as ScreenName, icon: Map, label: 'Mapa' },
  { id: 'report' as ScreenName, icon: Plus, label: 'Reportar', isFab: true },
  { id: 'community' as ScreenName, icon: Users, label: 'Comunidad' },
  { id: 'profile' as ScreenName, icon: User, label: 'Perfil' },
]

export function DesktopNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-72 flex-col border-r border-border bg-white px-5 py-6">
      <button
        onClick={() => onNavigate('dashboard')}
        className="mb-8 flex items-center gap-3 rounded-xl px-2 py-1 text-left"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <PawPrint className="h-6 w-6" />
        </span>
        <span>
          <span className="block text-lg font-semibold text-paws-dark">PawsConnect</span>
          <span className="block text-xs text-muted-foreground">Costa Rica</span>
        </span>
      </button>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-paws-dark'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 pb-safe z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          if (item.isFab) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
              >
                <Icon className="w-7 h-7 text-white" />
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-4 transition-all",
                isActive && "scale-105"
              )}
            >
              <div className={cn(
                "relative",
                isActive && "after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
              )}>
                <Icon 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} 
                />
              </div>
              <span className={cn(
                "text-xs mt-1 transition-colors",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
