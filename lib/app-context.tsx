'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'
import { demoPets } from './demo-data'
import type {
  Pet,
  UserProfile,
  RegisteredPet,
  CommunityPost,
  Notification,
  Activity,
  UserLocation,
  PetStatus,
} from './types'
export type * from './types'

const guest: UserProfile = {
  id: '',
  name: 'Visitante',
  email: '',
  phone: '',
  avatar: '/avatar.svg',
  location: 'Costa Rica',
  bio: '',
  petsCount: 0,
  reportsCount: 0,
  points: 0,
  badge: 'Amigo de las mascotas',
  joinedAt: '',
}
interface Snapshot {
  configured: boolean
  user: UserProfile | null
  pets: Pet[]
  registeredPets: RegisteredPet[]
  posts: CommunityPost[]
  notifications: Notification[]
  activities: Activity[]
}
const empty: Snapshot = {
  configured: true,
  user: null,
  pets: [],
  registeredPets: [],
  posts: [],
  notifications: [],
  activities: [],
}
export async function api<T = Record<string, unknown>>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    cache: 'no-store',
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || 'No pudimos completar la operación')
  return body as T
}
function useAppState() {
  const [liveSnapshot, setSnapshot] = useState<Snapshot>(empty)
  const [demo, setDemo] = useState(false)
  useEffect(() => {
    setDemo(new URLSearchParams(window.location.search).get('demo') === '1')
  }, [])
  const snapshot: Snapshot = demo
    ? {
        ...empty,
        configured: false,
        pets: demoPets,
        posts: demoPets.map((p) => ({
          id: `demo-${p.id}`,
          petId: p.id,
          userId: 'demo',
          userName: 'Comunidad de ejemplo',
          userAvatar: '/avatar.svg',
          petName: p.name,
          petImage: p.image,
          type: p.status === 'shelter' ? 'adoption' : p.status,
          content: p.description,
          location: p.location,
          likes: 0,
          comments: 0,
          liked: false,
          createdAt: 'Reporte ficticio de demostración',
        })),
      }
    : liveSnapshot
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    try {
      if (new URLSearchParams(window.location.search).get('demo') === '1') {
        setError(null)
        setLoading(false)
        return
      }
      const result = await api<Snapshot>('/api/state')
      setSnapshot(result.configured ? result : { ...empty, configured: false, pets: demoPets })
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de conexión')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void refresh().catch(() => {})
  }, [refresh])
  const mutate = useCallback(
    async <T,>(action: string, data?: unknown, id?: string): Promise<T> => {
      try {
        if (demo)
          throw new Error('La demostración es de solo lectura. Sal de ella para participar.')
        const response = await api<{ result: T }>('/api/actions', {
          method: 'POST',
          body: JSON.stringify({ action, data, id }),
        })
        // A failed refresh must not imply the already committed write failed.
        await refresh().catch(() => {
          toast.error('El cambio se guardó. Actualiza la página para verlo.')
        })
        return response.result
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Error al guardar')
        throw e
      }
    },
    [refresh, demo],
  )
  const authenticate = async (
    action: 'login' | 'register',
    email: string,
    password: string,
    name?: string,
  ) => {
    await api('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action, email, password, ...(action === 'register' ? { name } : {}) }),
    })
    await refresh()
  }
  const logout = async () => {
    await api('/api/auth', { method: 'DELETE' })
    await refresh()
  }

  const [statusFilter, setStatusFilter] = useState<PetStatus | 'all'>('all')
  const [speciesFilter, setSpeciesFilter] = useState<'dog' | 'cat' | 'other' | 'all'>('all')
  const [colorFilter, setColorFilter] = useState('all')
  const [sizeFilter, setSizeFilter] = useState<'small' | 'medium' | 'large' | 'all'>('all')
  const [radiusFilter, setRadiusFilter] = useState(50)
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const requestUserLocation = useCallback((): Promise<UserLocation | null> => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no permite usar ubicación.')
      return Promise.resolve(null)
    }
    setIsLocating(true)
    setLocationError(null)
    return new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          setUserLocation(location)
          setIsLocating(false)
          resolve(location)
        },
        (e) => {
          setLocationError(
            e.code === 1 ? 'Permiso de ubicación denegado.' : 'No pudimos obtener tu ubicación.',
          )
          setIsLocating(false)
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      ),
    )
  }, [])
  const normalize = (v: string) =>
    v
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  const origin = userLocation ?? { lat: 9.9281, lng: -84.0907 }
  const filteredPets = snapshot.pets.filter((pet) => {
    if (pet.resolvedAt) return false
    if (statusFilter !== 'all' && pet.status !== statusFilter) return false
    if (speciesFilter !== 'all' && pet.species !== speciesFilter) return false
    if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false
    if (colorFilter !== 'all' && !normalize(pet.color).includes(normalize(colorFilter)))
      return false
    const radians = (x: number) => (x * Math.PI) / 180
    const a =
      Math.sin(radians(pet.lat - origin.lat) / 2) ** 2 +
      Math.cos(radians(origin.lat)) *
        Math.cos(radians(pet.lat)) *
        Math.sin(radians(pet.lng - origin.lng) / 2) ** 2
    if (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a))) > radiusFilter)
      return false
    return normalize([pet.name, pet.breed, pet.location, pet.description].join(' ')).includes(
      normalize(searchQuery),
    )
  })
  return {
    ...snapshot,
    demo,
    user: snapshot.user ?? guest,
    authenticated: !!snapshot.user,
    loading,
    error,
    refresh,
    authenticate,
    logout,
    updateUser: (data: Partial<UserProfile>) =>
      mutate('profile', { ...(snapshot.user ?? guest), ...data }),
    addPet: (data: Omit<Pet, 'id' | 'reportedAt'>) => mutate<Pet>('createReport', data),
    updatePet: (id: string, data: Partial<Pet>) =>
      mutate('updateReport', { ...snapshot.pets.find((p) => p.id === id), ...data }, id),
    resolvePet: (id: string) => mutate('resolveReport', undefined, id),
    deletePet: (id: string) => mutate('deleteReport', undefined, id),
    addRegisteredPet: (data: Omit<RegisteredPet, 'id'>) => mutate('createRegisteredPet', data),
    updateRegisteredPet: (id: string, data: Partial<RegisteredPet>) =>
      mutate(
        'updateRegisteredPet',
        { ...snapshot.registeredPets.find((p) => p.id === id), ...data },
        id,
      ),
    deleteRegisteredPet: (id: string) => mutate('deleteRegisteredPet', undefined, id),
    toggleLike: (id: string) =>
      mutate('like', { liked: !snapshot.posts.find((p) => p.id === id)?.liked }, id).catch(
        () => {},
      ),
    markAsRead: (id: string) => mutate('readNotification', undefined, id).catch(() => {}),
    markAllAsRead: () => mutate('readAllNotifications').catch(() => {}),
    userLocation,
    setUserLocation,
    isLocating,
    locationError,
    requestUserLocation,
    statusFilter,
    setStatusFilter,
    speciesFilter,
    setSpeciesFilter,
    colorFilter,
    setColorFilter,
    sizeFilter,
    setSizeFilter,
    radiusFilter,
    setRadiusFilter,
    searchQuery,
    setSearchQuery,
    filteredPets,
  }
}
const AppContext = createContext<ReturnType<typeof useAppState> | undefined>(undefined)
export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState()
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
