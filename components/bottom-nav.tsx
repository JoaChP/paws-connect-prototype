'use client'

import { Home, Map, Plus, Users, User } from 'lucide-react'
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

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 pb-safe z-50">
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
